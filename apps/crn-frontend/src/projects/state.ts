import { getOverrides } from '@asap-hub/flags';
import {
  createListQueryKeys,
  createQueryKeys,
  nullOnUndefined,
  withEmptyListFallback,
} from '@asap-hub/frontend-utils';
import {
  ComplianceReportPostRequest,
  FetchProjectMilestonesExportOptions,
  ListProjectMilestonesResponse,
  ListProjectResponse,
  ManuscriptFileType,
  ManuscriptPostRequest,
  ManuscriptResponse,
  MilestoneCreateRequest,
  ProjectDetail,
  ProjectMilestonesExportResponse,
  ProjectTool,
  ResearchOutputResponse,
  WorkspaceManuscriptsResponse,
} from '@asap-hub/model';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useAuthorization } from '../auth/useAuthorization';
import { useAlgolia } from '../hooks/algolia';
import { getManuscript } from '../network/teams/api';
import {
  manuscriptQueryKeys,
  useSetManuscriptItem,
} from '../network/teams/state';
import { getResearchOutputs } from '../shared-research/api';
import {
  createComplianceReport,
  createManuscript,
  createProjectMilestone,
  getProject,
  getProjectMilestones,
  getProjectMilestonesExport,
  getProjects,
  getWorkspaceManuscripts,
  MilestonesListOptions,
  patchProject,
  ProjectListOptions,
  resubmitManuscript,
  toListProjectResponse,
  uploadManuscriptFileViaPresignedUrl,
  waitForMilestonesSync,
  WorkspaceManuscriptsParams,
} from './api';

export const projectQueryKeys = createQueryKeys<ProjectListOptions>('projects');

export const projectMilestoneQueryKeys =
  createListQueryKeys<MilestonesListOptions>('project-milestones');

export const useProjects = (
  options: ProjectListOptions,
): ListProjectResponse => {
  const { client } = useAlgolia();
  return useSuspenseQuery({
    queryKey: projectQueryKeys.list(options),
    queryFn: (): Promise<ListProjectResponse> =>
      withEmptyListFallback(
        async () => toListProjectResponse(await getProjects(client, options)),
        { total: 0, items: [] },
      ),
  }).data;
};

// The detail cache is separate from the list cache — it always fetches
// complete detail data (list items hold incomplete Algolia records), so list
// entries never pollute this cache.
export const useProjectById = (id: string): ProjectDetail | undefined => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: projectQueryKeys.detail(id),
    queryFn: () =>
      nullOnUndefined(async () => getProject(id, await getAuthorization())),
  });
  return data ?? undefined;
};

// The PATCH response is written straight into the detail cache — never
// refetched, because Contentful has read-after-write lag (see docs §6.1).
export const usePatchProjectById = (id: string) => {
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (patch: { tools: ProjectTool[] }) =>
      patchProject(id, patch, await getAuthorization()),
    onSuccess: (updated, patch) => {
      // Always use patch.tools for the UI since the API may return stale data
      // due to Contentful's read-after-write delay.
      queryClient.setQueryData(projectQueryKeys.detail(id), {
        ...updated,
        tools: patch.tools,
      });
    },
  });
  return async (patch: { tools: ProjectTool[] }) => {
    await mutateAsync(patch);
  };
};

export const useProjectMilestones = (
  options: MilestonesListOptions,
): ListProjectMilestonesResponse => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: projectMilestoneQueryKeys.list(options),
    queryFn: (): Promise<ListProjectMilestonesResponse> =>
      withEmptyListFallback(
        async () => getProjectMilestones(options, await getAuthorization()),
        { total: 0, items: [] },
      ),
  }).data;
};

// Replaces the refreshProjectMilestonesIndex counter (R5): the bump
// re-keyed every milestone list, forcing a refetch on next render.
export const useInvalidateProjectMilestonesIndex = () => {
  const queryClient = useQueryClient();
  return useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    queryClient.invalidateQueries({
      queryKey: projectMilestoneQueryKeys.lists(),
    });
  }, [queryClient]);
};

export const useExportProjectMilestones = (
  projectId: string,
): ((
  options: FetchProjectMilestonesExportOptions,
) => Promise<ProjectMilestonesExportResponse>) => {
  const getAuthorization = useAuthorization();
  return useCallback(
    async (options) =>
      getProjectMilestonesExport(projectId, options, await getAuthorization()),
    [getAuthorization, projectId],
  );
};

export const useProjectArticlesSuggestions = (teamId: string) => {
  const algoliaClient = useAlgolia();

  return (searchQuery: string) =>
    getResearchOutputs(algoliaClient.client, {
      searchQuery,
      currentPage: null,
      pageSize: 5, // check the size
      documentType: ['Article'],
      teamId,
    }).then(({ hits }) =>
      (hits as ResearchOutputResponse[]).map(
        ({ id, title, documentType, type }) => ({
          label: title,
          value: id,
          documentType,
          type,
        }),
      ),
    );
};

export const useCreateProjectMilestone = (projectId: string) => {
  const getAuthorization = useAuthorization();
  const invalidateProjectMilestonesIndex =
    useInvalidateProjectMilestonesIndex();
  const { mutateAsync } = useMutation({
    mutationFn: async (data: MilestoneCreateRequest) => {
      const authorization = await getAuthorization();
      const result = await createProjectMilestone(
        projectId,
        data,
        authorization,
      );

      // TODO: align with product/design on how to handle cases where sync does
      // not complete within the polling window.
      await waitForMilestonesSync(projectId, authorization);

      return result.id;
    },
    onSuccess: () => {
      invalidateProjectMilestonesIndex();
    },
  });
  return mutateAsync;
};

// An empty id (form in create mode) resolves undefined without hitting the API.
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
    queryFn: () =>
      id
        ? nullOnUndefined(async () =>
            getManuscript(id, await getAuthorization()),
          )
        : null,
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

// `null` means there is nothing to fetch (e.g. a team-based project without a
// resolved team) — the query resolves to empty lists without hitting the API.
export const useWorkspaceManuscripts = (
  params: WorkspaceManuscriptsParams | null,
): WorkspaceManuscriptsResponse => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: manuscriptQueryKeys.workspace(params ?? {}),
    queryFn: async (): Promise<WorkspaceManuscriptsResponse> =>
      params
        ? getWorkspaceManuscripts(params, await getAuthorization())
        : { manuscripts: [], collaborationManuscripts: [] },
  });
  return data;
};

export const useInvalidateWorkspaceManuscripts = () => {
  const queryClient = useQueryClient();
  return useCallback(
    () =>
      queryClient.invalidateQueries({
        queryKey: manuscriptQueryKeys.workspaceAll,
      }),
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
        {
          ...payload,
          notificationList,
        },
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
        {
          ...payload,
          notificationList,
        },
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

export const usePostComplianceReport = () => {
  const getAuthorization = useAuthorization();
  const { mutateAsync } = useMutation({
    mutationFn: async (payload: ComplianceReportPostRequest) => {
      const notificationList = getOverrides()
        .COMPLIANCE_NOTIFICATION_LIST as string;
      return createComplianceReport(
        {
          ...payload,
          notificationList,
        },
        await getAuthorization(),
      );
    },
  });
  return mutateAsync;
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
