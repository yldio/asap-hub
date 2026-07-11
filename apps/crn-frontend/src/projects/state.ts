import { normalizeListOptions } from '@asap-hub/frontend-utils';
import {
  FetchProjectMilestonesExportOptions,
  ListProjectMilestonesResponse,
  ListProjectResponse,
  MilestoneCreateRequest,
  ProjectDetail,
  ProjectMilestonesExportResponse,
  ProjectTool,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useAuthorization } from '../auth/useAuthorization';
import { useAlgolia } from '../hooks/algolia';
import { getResearchOutputs } from '../shared-research/api';
import {
  createProjectMilestone,
  getProject,
  getProjectMilestones,
  getProjectMilestonesExport,
  getProjects,
  MilestonesListOptions,
  patchProject,
  ProjectListOptions,
  toListProjectResponse,
  waitForMilestonesSync,
} from './api';

export const projectQueryKeys = {
  all: ['projects'] as const,
  lists: () => [...projectQueryKeys.all, 'list'] as const,
  list: (options: ProjectListOptions) =>
    [...projectQueryKeys.lists(), normalizeListOptions(options)] as const,
  details: () => [...projectQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectQueryKeys.details(), id] as const,
};

export const projectMilestoneQueryKeys = {
  all: ['project-milestones'] as const,
  lists: () => [...projectMilestoneQueryKeys.all, 'list'] as const,
  list: (options: MilestonesListOptions) =>
    [
      ...projectMilestoneQueryKeys.lists(),
      normalizeListOptions(options),
    ] as const,
};

export const useProjects = (
  options: ProjectListOptions,
): ListProjectResponse => {
  const { client } = useAlgolia();
  return useSuspenseQuery({
    queryKey: projectQueryKeys.list(options),
    queryFn: async (): Promise<ListProjectResponse> => {
      try {
        return toListProjectResponse(await getProjects(client, options));
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

// The detail cache is separate from the list cache — it always fetches
// complete detail data (list items hold incomplete Algolia records), so list
// entries never pollute this cache.
export const useProjectById = (id: string): ProjectDetail | undefined => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: projectQueryKeys.detail(id),
    // getProject resolves undefined on a 404, but a queryFn must not return
    // undefined — cache null and map it back below.
    queryFn: async () =>
      (await getProject(id, await getAuthorization())) ?? null,
  });
  return data ?? undefined;
};

// The PATCH response is written straight into the detail cache — never
// refetched, because Contentful has read-after-write lag (see docs §6.1).
export const usePatchProjectById = (id: string) => {
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  return async (patch: { tools: ProjectTool[] }) => {
    const updated = await patchProject(id, patch, await getAuthorization());
    // Always use patch.tools for the UI since the API may return stale data
    // due to Contentful's read-after-write delay.
    queryClient.setQueryData(projectQueryKeys.detail(id), {
      ...updated,
      tools: patch.tools,
    });
  };
};

// Replaces the refreshProjectState counter bumps in ProjectManuscript /
// ProjectComplianceReport: the bump invalidated the project-detail fetch
// selector, so the project (and its embedded manuscripts) re-fetch (R5).
export const useInvalidateProjectById = (id: string) => {
  const queryClient = useQueryClient();
  return useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    queryClient.invalidateQueries({ queryKey: projectQueryKeys.detail(id) });
  }, [queryClient, id]);
};

export const useProjectMilestones = (
  options: MilestonesListOptions,
): ListProjectMilestonesResponse => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: projectMilestoneQueryKeys.list(options),
    queryFn: async (): Promise<ListProjectMilestonesResponse> => {
      try {
        return await getProjectMilestones(options, await getAuthorization());
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
  return async (data: MilestoneCreateRequest) => {
    const authorization = await getAuthorization();
    const result = await createProjectMilestone(projectId, data, authorization);

    // TODO: align with product/design on how to handle cases where sync does not
    // complete within the polling window.
    await waitForMilestonesSync(projectId, authorization);

    invalidateProjectMilestonesIndex();

    return result.id;
  };
};
