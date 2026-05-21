import { getOverrides } from '@asap-hub/flags';
import { BackendError } from '@asap-hub/frontend-utils';
import {
  ComplianceReportPostRequest,
  DiscussionRequest,
  DiscussionResponse,
  ListPartialManuscriptResponse,
  ListTeamResponse,
  ManuscriptDataObject,
  ManuscriptFileType,
  ManuscriptPostRequest,
  ManuscriptPutRequest,
  ManuscriptResponse,
  PartialManuscriptResponse,
  ResearchOutputResponse,
  TeamPatchRequest,
  TeamResponse,
} from '@asap-hub/model';
import { useAuth0CRN, useCurrentUserCRN } from '@asap-hub/react-context';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { useAlgolia } from '../../hooks/algolia';
import { getPresignedUrl } from '../../shared-api/files';
import { useSetResearchOutputItem } from '../../shared-research/state';
import {
  createComplianceReport,
  createDiscussion,
  createManuscript,
  createPreprintResearchOutput,
  downloadFullComplianceDataset,
  getAlgoliaTeams,
  getManuscript,
  getManuscripts,
  getManuscriptsByIds,
  getManuscriptVersionByManuscriptId,
  getManuscriptVersions,
  getTeam,
  GetTeamsListOptions,
  ManuscriptsOptions,
  markDiscussionAsRead,
  patchTeam,
  resubmitManuscript,
  updateDiscussion,
  updateManuscript,
  uploadManuscriptFileViaPresignedUrl,
} from './api';

const NOTIFICATION_LIST_OVERRIDE = () =>
  getOverrides().COMPLIANCE_NOTIFICATION_LIST as string;

// --- Query keys ----------------------------------------------------------

export const teamsListQueryKey = (options: GetTeamsListOptions) =>
  ['teams', 'list', options] as const;

export const teamQueryKey = (id: string) => ['teams', 'item', id] as const;

export const manuscriptsListQueryKey = (options: ManuscriptsOptions) =>
  ['manuscripts', 'list', options] as const;

export const manuscriptQueryKey = (id: string) =>
  ['manuscripts', 'item', id] as const;

export const manuscriptBatchQueryKey = (ids: ReadonlyArray<string>) =>
  ['manuscripts', 'batch', ids] as const;

export const discussionQueryKey = (id: string) =>
  ['discussions', 'item', id] as const;

// --- Teams: list ---------------------------------------------------------

export const usePrefetchTeams = (options: GetTeamsListOptions) => {
  const { client } = useAlgolia();
  const queryClient = useQueryClient();

  useDeepCompareEffect(() => {
    const key = teamsListQueryKey(options);
    if (queryClient.getQueryData(key) !== undefined) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    queryClient.prefetchQuery({
      queryKey: key,
      queryFn: () => getAlgoliaTeams(client, options),
    });
  }, [options, client, queryClient]);
};

export const useTeams = (options: GetTeamsListOptions): ListTeamResponse => {
  const { client } = useAlgolia();
  const { data } = useSuspenseQuery({
    queryKey: teamsListQueryKey(options),
    queryFn: () => getAlgoliaTeams(client, options),
  });
  return data;
};

// --- Teams: by id --------------------------------------------------------

export const useTeamById = (id: string): TeamResponse | undefined => {
  const auth0 = useAuth0CRN();
  const { data } = useSuspenseQuery({
    queryKey: teamQueryKey(id),
    queryFn: async (): Promise<TeamResponse | null> => {
      const token = await auth0.getTokenSilently();
      const team = await getTeam(id, `Bearer ${token}`);
      return team ?? null;
    },
    staleTime: Infinity,
  });
  return data ?? undefined;
};

export const useRefreshTeamById = (id: string) => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: teamQueryKey(id) });
};

export const usePatchTeamById = (id: string) => {
  const auth0 = useAuth0CRN();
  const queryClient = useQueryClient();
  return async (patch: TeamPatchRequest) => {
    const token = await auth0.getTokenSilently();
    const updated = await patchTeam(id, patch, `Bearer ${token}`);
    if (updated) {
      // Merge into the existing cached team so other tabs see the patch
      // without an extra fetch (mirrors the prior Recoil overlay).
      queryClient.setQueryData<TeamResponse | null>(teamQueryKey(id), (prev) =>
        prev ? { ...prev, ...updated } : updated,
      );
    }
  };
};

// --- Manuscripts: single + invalidation ----------------------------------

export const useInvalidateManuscriptIndex = () => {
  const queryClient = useQueryClient();
  return useCallback(() => {
    // Invalidate all manuscript-list queries; per-id caches stay valid.
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    queryClient.invalidateQueries({ queryKey: ['manuscripts', 'list'] });
  }, [queryClient]);
};

export const useSetManuscriptItem = () => {
  const queryClient = useQueryClient();
  return useCallback(
    (manuscript: ManuscriptResponse) => {
      queryClient.setQueryData(manuscriptQueryKey(manuscript.id), manuscript);
    },
    [queryClient],
  );
};

// Mirrors React's useState setter shape so consumers built around
// useRecoilState (which returns a SetterOrUpdater) keep compiling.
export type ManuscriptByIdResult = [
  ManuscriptResponse | undefined,
  Dispatch<SetStateAction<ManuscriptResponse | undefined>>,
];

export const useManuscriptById = (id: string): ManuscriptByIdResult => {
  const auth0 = useAuth0CRN();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery({
    queryKey: manuscriptQueryKey(id),
    queryFn: async (): Promise<ManuscriptResponse | null> => {
      if (!id) return null;
      const token = await auth0.getTokenSilently();
      const manuscript = await getManuscript(id, `Bearer ${token}`);
      return manuscript ?? null;
    },
  });

  const setManuscript = useCallback<
    Dispatch<SetStateAction<ManuscriptResponse | undefined>>
  >(
    (next) => {
      queryClient.setQueryData<ManuscriptResponse | null>(
        manuscriptQueryKey(id),
        (current) => {
          const previous = current ?? undefined;
          const resolved =
            typeof next === 'function'
              ? (
                  next as (
                    prev: ManuscriptResponse | undefined,
                  ) => ManuscriptResponse | undefined
                )(previous)
              : next;
          return resolved ?? null;
        },
      );
    },
    [queryClient, id],
  );

  return [data ?? undefined, setManuscript];
};

export const useBatchManuscriptsByIds = (ids: ReadonlyArray<string>): void => {
  const auth0 = useAuth0CRN();
  const queryClient = useQueryClient();
  const deduplicatedIds = [...new Set(ids.filter(Boolean))].sort();

  // useSuspenseQuery throws a promise on the first call; once resolved, the
  // per-manuscript caches are seeded so individual useManuscriptById calls
  // for these ids do not refetch.
  useSuspenseQuery({
    queryKey: manuscriptBatchQueryKey(deduplicatedIds),
    queryFn: async (): Promise<true> => {
      if (!deduplicatedIds.length) return true;
      const token = await auth0.getTokenSilently();
      const manuscripts = await getManuscriptsByIds(
        deduplicatedIds,
        `Bearer ${token}`,
      );
      manuscripts.forEach((manuscript) => {
        queryClient.setQueryData(manuscriptQueryKey(manuscript.id), manuscript);
      });
      return true;
    },
  });
};

// --- Manuscripts: mutations ----------------------------------------------

export const usePostManuscript = () => {
  const auth0 = useAuth0CRN();
  const setManuscriptItem = useSetManuscriptItem();
  return async (payload: ManuscriptPostRequest) => {
    const token = await auth0.getTokenSilently();
    const manuscript = await createManuscript(
      { ...payload, notificationList: NOTIFICATION_LIST_OVERRIDE() },
      `Bearer ${token}`,
    );
    setManuscriptItem(manuscript);
    return manuscript;
  };
};

export const useResubmitManuscript = () => {
  const auth0 = useAuth0CRN();
  const setManuscriptItem = useSetManuscriptItem();
  return async (id: string, payload: ManuscriptPostRequest) => {
    const token = await auth0.getTokenSilently();
    const manuscript = await resubmitManuscript(
      id,
      { ...payload, notificationList: NOTIFICATION_LIST_OVERRIDE() },
      `Bearer ${token}`,
    );
    setManuscriptItem(manuscript);
    return manuscript;
  };
};

export const usePutManuscript = () => {
  const auth0 = useAuth0CRN();
  const setManuscriptItem = useSetManuscriptItem();
  return async (id: string, payload: ManuscriptPutRequest) => {
    const token = await auth0.getTokenSilently();
    const manuscript = await updateManuscript(
      id,
      { ...payload, notificationList: NOTIFICATION_LIST_OVERRIDE() },
      `Bearer ${token}`,
    );
    setManuscriptItem(manuscript);
    // Note: list-level cache invalidation is deliberately omitted here.
    // Consumers (Compliance, ProjectComplianceReport) call
    // useManuscripts(...).refresh(updated) to merge the new status into the
    // current list snapshot. Invalidating would trigger a refetch that
    // replaces those local updates with the original list response.
    return manuscript;
  };
};

// --- Manuscripts: list (per-team workspace) ------------------------------

export type UseManuscriptsResult = ListPartialManuscriptResponse & {
  refresh: (manuscript: ManuscriptDataObject) => void;
};

export const useManuscripts = (
  options: ManuscriptsOptions,
): UseManuscriptsResult => {
  const { client } = useAlgolia();
  const queryClient = useQueryClient();
  const queryKey = manuscriptsListQueryKey(options);

  const { data } = useSuspenseQuery({
    queryKey,
    queryFn: () => getManuscripts(client, options),
  });
  const resolved = data;

  const refresh = useCallback(
    (updatedManuscriptItem: ManuscriptDataObject) => {
      queryClient.setQueryData<ListPartialManuscriptResponse>(
        queryKey,
        (previous) => {
          if (!previous) return previous;
          return {
            ...previous,
            items: previous.items.map(
              (previousItem: PartialManuscriptResponse) =>
                previousItem.id === updatedManuscriptItem.id
                  ? {
                      ...previousItem,
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
                  : previousItem,
            ),
          };
        },
      );
    },
    [queryClient, queryKey],
  );

  return { ...resolved, refresh };
};

// --- Manuscript versions / suggestions -----------------------------------

export const useManuscriptVersionSuggestions = () => {
  const { client } = useAlgolia();
  return (searchQuery: string, teamId?: string) =>
    getManuscriptVersions(client, {
      searchQuery,
      currentPage: null,
      pageSize: 100,
      teamId,
    }).then(({ items }) => items);
};

export const useLatestManuscriptVersionByManuscriptId = () => {
  const { client } = useAlgolia();
  return (manuscriptId: string) =>
    getManuscriptVersionByManuscriptId(client, manuscriptId);
};

// --- Compliance ----------------------------------------------------------

export const usePostComplianceReport = () => {
  const auth0 = useAuth0CRN();
  return async (payload: ComplianceReportPostRequest) => {
    const token = await auth0.getTokenSilently();
    return createComplianceReport(
      { ...payload, notificationList: NOTIFICATION_LIST_OVERRIDE() },
      `Bearer ${token}`,
    );
  };
};

export const useIsComplianceReviewer = (): boolean => {
  const { role, openScienceTeamMember } = useCurrentUserCRN() ?? {};
  return role === 'Staff' && !!openScienceTeamMember;
};

export const useUploadManuscriptFileViaPresignedUrl = () => {
  const auth0 = useAuth0CRN();
  return async (
    file: File,
    fileType: ManuscriptFileType,
    handleError: (errorMessage: string) => void,
  ) => {
    const token = await auth0.getTokenSilently();
    return uploadManuscriptFileViaPresignedUrl(
      file,
      fileType,
      `Bearer ${token}`,
      handleError,
    );
  };
};

export const useDownloadFullComplianceDataset = () => {
  const auth0 = useAuth0CRN();
  return async () => {
    const token = await auth0.getTokenSilently();
    return downloadFullComplianceDataset(`Bearer ${token}`);
  };
};

// --- Discussions ---------------------------------------------------------

export const useSetDiscussion = () => {
  const queryClient = useQueryClient();
  return useCallback(
    (discussion: DiscussionResponse) => {
      queryClient.setQueryData(discussionQueryKey(discussion.id), discussion);
    },
    [queryClient],
  );
};

export const useReplyToDiscussion = () => {
  const auth0 = useAuth0CRN();
  const setDiscussion = useSetDiscussion();
  const setManuscriptItem = useSetManuscriptItem();
  return async (manuscriptId: string, id: string, patch: DiscussionRequest) => {
    const token = await auth0.getTokenSilently();
    const authorization = `Bearer ${token}`;
    try {
      const discussion = await updateDiscussion(
        id,
        { ...patch, notificationList: NOTIFICATION_LIST_OVERRIDE() },
        authorization,
      );
      setDiscussion(discussion);
      const updatedManuscript = await getManuscript(
        manuscriptId,
        authorization,
      );
      if (updatedManuscript) setManuscriptItem(updatedManuscript);
    } catch (error) {
      if (error instanceof BackendError && error.response?.statusCode === 403) {
        const updatedManuscript = await getManuscript(
          manuscriptId,
          authorization,
        );
        if (updatedManuscript) setManuscriptItem(updatedManuscript);
      }
      throw error;
    }
  };
};

export const useMarkDiscussionAsRead = () => {
  const auth0 = useAuth0CRN();
  const queryClient = useQueryClient();
  const setDiscussion = useSetDiscussion();
  const setManuscriptItem = useSetManuscriptItem();

  return async (manuscriptId: string, discussionId: string) => {
    const manuscript = queryClient.getQueryData<ManuscriptResponse>(
      manuscriptQueryKey(manuscriptId),
    );
    if (manuscript) {
      const discussions = manuscript.discussions.map((discussion) =>
        discussion.id === discussionId
          ? { ...discussion, read: true }
          : discussion,
      );
      setManuscriptItem({ ...manuscript, discussions });
    }

    const token = await auth0.getTokenSilently();
    const discussion = await markDiscussionAsRead(
      discussionId,
      `Bearer ${token}`,
    );
    setDiscussion(discussion);
  };
};

export const useCreateDiscussion = () => {
  const auth0 = useAuth0CRN();
  const setManuscriptItem = useSetManuscriptItem();
  return async (
    manuscriptId: string,
    title: string,
    text: string,
  ): Promise<string | undefined> => {
    const token = await auth0.getTokenSilently();
    const authorization = `Bearer ${token}`;
    try {
      const discussion = await createDiscussion(
        {
          manuscriptId,
          title,
          text,
          notificationList: NOTIFICATION_LIST_OVERRIDE(),
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
      if (error instanceof BackendError && error.response?.statusCode === 403) {
        const updatedManuscript = await getManuscript(
          manuscriptId,
          authorization,
        );
        if (updatedManuscript) setManuscriptItem(updatedManuscript);
      }
      throw error;
    }
  };
};

// --- Files ---------------------------------------------------------------

export const usePresignedUrl = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth0 = useAuth0CRN();

  const fetchPresignedUrl = async (filename: string, contentType: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = await auth0.getTokenSilently();
      const { presignedUrl: uploadUrl } = await getPresignedUrl(
        filename,
        `Bearer ${token}`,
        contentType,
      );
      return uploadUrl;
    } catch (err) {
      setError('Failed to generate pre-signed URL');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchPresignedUrl, loading, error };
};

// --- Preprint research output -------------------------------------------

export const usePostPreprintResearchOutput = () => {
  const auth0 = useAuth0CRN();
  const setResearchOutputItem = useSetResearchOutputItem();
  return async (manuscriptId: string): Promise<ResearchOutputResponse> => {
    const token = await auth0.getTokenSilently();
    const preprintResearchOutput = await createPreprintResearchOutput(
      manuscriptId,
      `Bearer ${token}`,
    );
    await setResearchOutputItem(preprintResearchOutput);
    return preprintResearchOutput;
  };
};
