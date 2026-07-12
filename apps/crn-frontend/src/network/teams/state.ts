import { getOverrides } from '@asap-hub/flags';
import { BackendError, normalizeListOptions } from '@asap-hub/frontend-utils';
import {
  ComplianceReportPostRequest,
  DiscussionRequest,
  DiscussionResponse,
  ListPartialManuscriptResponse,
  ListTeamResponse,
  ManuscriptDataObject,
  ManuscriptFileResponse,
  ManuscriptFileType,
  ManuscriptPostRequest,
  ManuscriptPutRequest,
  ManuscriptResponse,
  ManuscriptWorkspaceTab,
  ManuscriptWorkspaceUrlResponse,
  ResearchOutputResponse,
  TeamResponse,
} from '@asap-hub/model';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useAuthorization } from '../../auth/useAuthorization';
import { useAlgolia } from '../../hooks/algolia';
import { useSetResearchOutputItem } from '../../shared-research/state';
import {
  createComplianceReport,
  createDiscussion,
  createManuscript,
  createPreprintResearchOutput,
  downloadFullComplianceDataset,
  getManuscript,
  getManuscriptWorkspaceUrl,
  getManuscriptsByIds,
  getManuscripts,
  getManuscriptVersions,
  getManuscriptVersionByManuscriptId,
  getTeam,
  ManuscriptsOptions,
  markDiscussionAsRead,
  resubmitManuscript,
  updateDiscussion,
  updateManuscript,
  uploadManuscriptFileViaPresignedUrl,
  GetTeamsListOptions,
  getAlgoliaTeams,
} from './api';

export const teamQueryKeys = {
  all: ['teams'] as const,
  lists: () => [...teamQueryKeys.all, 'list'] as const,
  list: (options: GetTeamsListOptions) =>
    [...teamQueryKeys.lists(), normalizeListOptions(options)] as const,
  details: () => [...teamQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...teamQueryKeys.details(), id] as const,
};

type ManuscriptWorkspaceUrlParams = {
  manuscriptId: string;
  tab?: ManuscriptWorkspaceTab;
  projectWorkspaceEnabled?: boolean;
};

export const manuscriptQueryKeys = {
  all: ['manuscripts'] as const,
  lists: () => [...manuscriptQueryKeys.all, 'list'] as const,
  list: (options: ManuscriptsOptions) =>
    [...manuscriptQueryKeys.lists(), normalizeListOptions(options)] as const,
  details: () => [...manuscriptQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...manuscriptQueryKeys.details(), id] as const,
  batch: (ids: ReadonlyArray<string>) =>
    [...manuscriptQueryKeys.all, 'batch', ids] as const,
  workspaceUrl: (params: ManuscriptWorkspaceUrlParams) =>
    [
      ...manuscriptQueryKeys.all,
      'workspace-url',
      normalizeListOptions(params),
    ] as const,
};

export const discussionQueryKeys = {
  all: ['discussions'] as const,
  detail: (id: string) => [...discussionQueryKeys.all, id] as const,
};

export const useTeams = (options: GetTeamsListOptions): ListTeamResponse => {
  const algoliaClient = useAlgolia();
  return useSuspenseQuery({
    queryKey: teamQueryKeys.list(options),
    queryFn: async (): Promise<ListTeamResponse> => {
      try {
        return await getAlgoliaTeams(algoliaClient.client, options);
      } catch (error) {
        // Errors re-throw to the error boundary; non-Error rejections
        // become an empty list.
        if (error instanceof Error) {
          throw error;
        }
        return { total: 0, items: [] };
      }
    },
  }).data;
};

export const useTeamById = (id: string): TeamResponse | undefined => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: teamQueryKeys.detail(id),
    // getTeam resolves undefined on a 404, but a queryFn must not return
    // undefined — cache null and map it back below.
    queryFn: async () => (await getTeam(id, await getAuthorization())) ?? null,
  });
  return data ?? undefined;
};

// Replaces the refreshTeamState counter bumps in TeamManuscript /
// TeamComplianceReport: the bump invalidated the team-detail fetch selector,
// so the team (and its embedded manuscripts) re-fetch (R5).
export const useInvalidateTeamById = (id: string) => {
  const queryClient = useQueryClient();
  return useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    queryClient.invalidateQueries({ queryKey: teamQueryKeys.detail(id) });
  }, [queryClient, id]);
};

export const useManuscriptById = (
  id: string,
): [
  ManuscriptResponse | undefined,
  Dispatch<SetStateAction<ManuscriptResponse | undefined>>,
] => {
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery({
    queryKey: manuscriptQueryKeys.detail(id),
    // getManuscript resolves undefined on a 404, but a queryFn must not
    // return undefined — cache null and map it back below.
    queryFn: async () =>
      (await getManuscript(id, await getAuthorization())) ?? null,
  });
  const setManuscript = useCallback<
    Dispatch<SetStateAction<ManuscriptResponse | undefined>>
  >(
    (action) => {
      queryClient.setQueryData<ManuscriptResponse | null>(
        manuscriptQueryKeys.detail(id),
        (cached) => {
          const next =
            typeof action === 'function' ? action(cached ?? undefined) : action;
          // setQueryData treats an undefined updater result as "no update";
          // cache null instead so writes of undefined still land.
          return next ?? null;
        },
      );
    },
    [queryClient, id],
  );
  return [data ?? undefined, setManuscript];
};

export const useManuscriptWorkspaceUrl = (
  manuscriptId: string,
  tab?: ManuscriptWorkspaceTab,
  projectWorkspaceEnabled?: boolean,
): ManuscriptWorkspaceUrlResponse | undefined => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: manuscriptQueryKeys.workspaceUrl({
      manuscriptId,
      tab,
      projectWorkspaceEnabled,
    }),
    // getManuscriptWorkspaceUrl resolves undefined on a 404 — cache null and
    // map it back below (a queryFn must not return undefined).
    queryFn: async () =>
      (await getManuscriptWorkspaceUrl(
        manuscriptId,
        await getAuthorization(),
        tab,
        projectWorkspaceEnabled,
      )) ?? null,
  });
  return data ?? undefined;
};

// Batch hydration: one suspense query per deduplicated id set makes the
// single getManuscriptsByIds call and fans the results into the manuscript
// detail keys, so the per-card useManuscriptById reads hit the cache without
// fetching. With no ids the query is seeded with initialData so it resolves
// immediately without suspending or hitting the API.
export const useBatchManuscriptsByIds = (ids: ReadonlyArray<string>): void => {
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  const deduplicatedIds = [...new Set(ids.filter(Boolean))].sort();
  useSuspenseQuery({
    queryKey: manuscriptQueryKeys.batch(deduplicatedIds),
    queryFn: async () => {
      if (!deduplicatedIds.length) {
        return 0;
      }
      const manuscripts = await getManuscriptsByIds(
        deduplicatedIds,
        await getAuthorization(),
      );
      manuscripts.forEach((manuscript) => {
        queryClient.setQueryData(
          manuscriptQueryKeys.detail(manuscript.id),
          manuscript,
        );
      });
      return manuscripts.length;
    },
    // With no ids there is nothing to fetch: seed a result so the query is
    // already resolved and the call site never suspends.
    ...(deduplicatedIds.length ? {} : { initialData: 0 }),
  });
};

// Writes a mutation response into the manuscript detail cache — never
// refetched, because Contentful has read-after-write lag. The manuscripts
// list re-syncs via useManuscripts's refresh updater instead.
export const useSetManuscriptItem = () => {
  const queryClient = useQueryClient();
  return useCallback(
    (manuscript: ManuscriptResponse) => {
      queryClient.setQueryData(
        manuscriptQueryKeys.detail(manuscript.id),
        manuscript,
      );
    },
    [queryClient],
  );
};

export const usePostManuscript = () => {
  const getAuthorization = useAuthorization();
  const setManuscriptItem = useSetManuscriptItem();
  const { mutateAsync } = useMutation({
    mutationFn: async (payload: ManuscriptPostRequest) => {
      const notificationList = getOverrides()
        .COMPLIANCE_NOTIFICATION_LIST as string;
      return createManuscript(
        { ...payload, notificationList },
        await getAuthorization(),
      );
    },
    onSuccess: (manuscript) => {
      setManuscriptItem(manuscript);
    },
  });
  return mutateAsync;
};

export const useResubmitManuscript = () => {
  const getAuthorization = useAuthorization();
  const setManuscriptItem = useSetManuscriptItem();
  const { mutateAsync } = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: ManuscriptPostRequest;
    }) => {
      const notificationList = getOverrides()
        .COMPLIANCE_NOTIFICATION_LIST as string;
      return resubmitManuscript(
        id,
        { ...payload, notificationList },
        await getAuthorization(),
      );
    },
    onSuccess: (manuscript) => {
      setManuscriptItem(manuscript);
    },
  });
  return (id: string, payload: ManuscriptPostRequest) =>
    mutateAsync({ id, payload });
};

export const usePutManuscript = () => {
  const getAuthorization = useAuthorization();
  const setManuscriptItem = useSetManuscriptItem();
  const { mutateAsync } = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: ManuscriptPutRequest;
    }) => {
      const notificationList = getOverrides()
        .COMPLIANCE_NOTIFICATION_LIST as string;
      return updateManuscript(
        id,
        { ...payload, notificationList },
        await getAuthorization(),
      );
    },
    onSuccess: (manuscript) => {
      setManuscriptItem(manuscript);
    },
  });
  return (id: string, payload: ManuscriptPutRequest) =>
    mutateAsync({ id, payload });
};

export const usePostComplianceReport = () => {
  const getAuthorization = useAuthorization();
  const { mutateAsync } = useMutation({
    mutationFn: async (payload: ComplianceReportPostRequest) => {
      const notificationList = getOverrides()
        .COMPLIANCE_NOTIFICATION_LIST as string;
      return createComplianceReport(
        { ...payload, notificationList },
        await getAuthorization(),
      );
    },
  });
  return mutateAsync;
};

export const useIsComplianceReviewer = (): boolean => {
  const { role, openScienceTeamMember } = useCurrentUserCRN() ?? {};
  return role === 'Staff' && !!openScienceTeamMember;
};

// Uses S3 presigned URL to upload file
export const useUploadManuscriptFileViaPresignedUrl = () => {
  const getAuthorization = useAuthorization();
  const { mutateAsync } = useMutation({
    mutationFn: async ({
      file,
      fileType,
      handleError,
    }: {
      file: File;
      fileType: ManuscriptFileType;
      handleError: (errorMessage: string) => void;
    }) =>
      uploadManuscriptFileViaPresignedUrl(
        file,
        fileType,
        await getAuthorization(),
        handleError,
      ),
  });
  return (
    file: File,
    fileType: ManuscriptFileType,
    handleError: (errorMessage: string) => void,
  ) => mutateAsync({ file, fileType, handleError });
};

export const useDownloadFullComplianceDataset = () => {
  const getAuthorization = useAuthorization();

  return async () => downloadFullComplianceDataset(await getAuthorization());
};

export const useSetDiscussion = () => {
  const queryClient = useQueryClient();
  return useCallback(
    (discussion: DiscussionResponse) => {
      queryClient.setQueryData(
        discussionQueryKeys.detail(discussion.id),
        discussion,
      );
    },
    [queryClient],
  );
};

export const useReplyToDiscussion = () => {
  const getAuthorization = useAuthorization();
  const setDiscussion = useSetDiscussion();
  const setManuscriptItem = useSetManuscriptItem();

  const { mutateAsync } = useMutation({
    mutationFn: async ({
      manuscriptId,
      id,
      patch,
    }: {
      manuscriptId: string;
      id: string;
      patch: DiscussionRequest;
    }) => {
      const notificationList = getOverrides()
        .COMPLIANCE_NOTIFICATION_LIST as string;
      const authorization = await getAuthorization();

      try {
        const discussion = await updateDiscussion(
          id,
          { ...patch, notificationList },
          authorization,
        );
        setDiscussion(discussion);
        const updatedManuscript = await getManuscript(
          manuscriptId,
          authorization,
        );
        if (updatedManuscript) setManuscriptItem(updatedManuscript);
      } catch (error) {
        // 403-triggered manuscript re-fetch before re-throwing (error-path
        // cache sync), preserved verbatim.
        if (
          error instanceof BackendError &&
          (error as BackendError).response?.statusCode === 403
        ) {
          const updatedManuscript = await getManuscript(
            manuscriptId,
            authorization,
          );
          if (updatedManuscript) setManuscriptItem(updatedManuscript);
        }
        throw error;
      }
    },
  });
  return (manuscriptId: string, id: string, patch: DiscussionRequest) =>
    mutateAsync({ manuscriptId, id, patch });
};

export const useMarkDiscussionAsRead = () => {
  const getAuthorization = useAuthorization();
  const setDiscussion = useSetDiscussion();
  const setManuscriptItem = useSetManuscriptItem();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    onMutate: ({
      manuscriptId,
      discussionId,
    }: {
      manuscriptId: string;
      discussionId: string;
    }) => {
      // Optimistic update from the cached manuscript before awaiting the API.
      const manuscript = queryClient.getQueryData<ManuscriptResponse | null>(
        manuscriptQueryKeys.detail(manuscriptId),
      );

      if (manuscript) {
        const discussions = manuscript.discussions.map((discussion) => {
          if (discussion.id === discussionId) {
            return { ...discussion, read: true };
          }
          return discussion;
        });

        setManuscriptItem({ ...manuscript, discussions });
      }
    },
    mutationFn: async ({
      discussionId,
    }: {
      manuscriptId: string;
      discussionId: string;
    }) => markDiscussionAsRead(discussionId, await getAuthorization()),
    onSuccess: (discussion) => {
      setDiscussion(discussion);
    },
  });
  return async (manuscriptId: string, discussionId: string) => {
    await mutateAsync({ manuscriptId, discussionId });
  };
};

export const useManuscripts = (
  options: ManuscriptsOptions,
): ListPartialManuscriptResponse & {
  refresh: (manuscript: ManuscriptDataObject) => void;
} => {
  const algoliaClient = useAlgolia();
  const queryClient = useQueryClient();

  const manuscripts = useSuspenseQuery({
    queryKey: manuscriptQueryKeys.list(options),
    queryFn: async (): Promise<ListPartialManuscriptResponse> => {
      try {
        return await getManuscripts(algoliaClient.client, options);
      } catch (error) {
        // Errors re-throw to the error boundary; non-Error rejections
        // become an empty list.
        if (error instanceof Error) {
          throw error;
        }
        return { total: 0, items: [] };
      }
    },
  }).data;

  // Surgical write-through after a manuscript mutation: merges the selected
  // fields into the item inside every cached manuscript list. Never a
  // refetch — Algolia has indexing lag after mutations.
  const refreshManuscripts = useCallback(
    (updatedManuscriptItem: ManuscriptDataObject) => {
      queryClient.setQueriesData<ListPartialManuscriptResponse>(
        { queryKey: manuscriptQueryKeys.lists() },
        (previousManuscripts) =>
          previousManuscripts && {
            ...previousManuscripts,
            items: previousManuscripts.items.map((previousManuscriptItem) =>
              previousManuscriptItem.id === updatedManuscriptItem.id
                ? {
                    ...previousManuscriptItem,
                    status: updatedManuscriptItem.status,
                    assignedUsers: updatedManuscriptItem.assignedUsers,
                    apcAmountPaid: updatedManuscriptItem.apcAmountPaid,
                    apcAmountRequested:
                      updatedManuscriptItem.apcAmountRequested,
                    apcCoverageRequestStatus:
                      updatedManuscriptItem.apcCoverageRequestStatus,
                    apcRequested: updatedManuscriptItem.apcRequested,
                    declinedReason: updatedManuscriptItem.declinedReason,
                  }
                : previousManuscriptItem,
            ),
          },
      );
    },
    [queryClient],
  );

  return { ...manuscripts, refresh: refreshManuscripts };
};

export const useManuscriptVersionSuggestions = () => {
  const algoliaClient = useAlgolia();

  return (searchQuery: string, teamId?: string) =>
    getManuscriptVersions(algoliaClient.client, {
      searchQuery,
      currentPage: null,
      pageSize: 100,
      teamId,
    }).then(({ items }) => items);
};

export const useLatestManuscriptVersionByManuscriptId = () => {
  const algoliaClient = useAlgolia();

  return (manuscriptId: string) =>
    getManuscriptVersionByManuscriptId(algoliaClient.client, manuscriptId);
};

export const useCreateDiscussion = () => {
  const getAuthorization = useAuthorization();
  const setManuscriptItem = useSetManuscriptItem();

  const { mutateAsync } = useMutation({
    mutationFn: async ({
      manuscriptId,
      title,
      text,
      files,
    }: {
      manuscriptId: string;
      title: string;
      text: string;
      files?: ManuscriptFileResponse[];
    }): Promise<string | undefined> => {
      const notificationList = getOverrides()
        .COMPLIANCE_NOTIFICATION_LIST as string;
      const authorization = await getAuthorization();

      try {
        const discussion = await createDiscussion(
          {
            manuscriptId,
            title,
            text,
            files,
            notificationList,
          },
          authorization,
        );
        const updatedManuscript = await getManuscript(
          manuscriptId,
          authorization,
        );
        if (updatedManuscript) setManuscriptItem(updatedManuscript);
        return discussion.id;
      } catch (error) {
        // 403-triggered manuscript re-fetch before re-throwing (error-path
        // cache sync), preserved verbatim.
        if (
          error instanceof BackendError &&
          (error as BackendError).response?.statusCode === 403
        ) {
          const updatedManuscript = await getManuscript(
            manuscriptId,
            authorization,
          );
          if (updatedManuscript) setManuscriptItem(updatedManuscript);
        }
        throw error;
      }
    },
  });
  return (
    manuscriptId: string,
    title: string,
    text: string,
    files?: ManuscriptFileResponse[],
  ): Promise<string | undefined> =>
    mutateAsync({ manuscriptId, title, text, files });
};

export const usePostPreprintResearchOutput = () => {
  const getAuthorization = useAuthorization();
  const setResearchOutputItem = useSetResearchOutputItem();

  const { mutateAsync } = useMutation({
    mutationFn: async (manuscriptId: string): Promise<ResearchOutputResponse> =>
      createPreprintResearchOutput(manuscriptId, await getAuthorization()),
    onSuccess: (preprintResearchOutput) => {
      setResearchOutputItem(preprintResearchOutput);
    },
  });
  return mutateAsync;
};
