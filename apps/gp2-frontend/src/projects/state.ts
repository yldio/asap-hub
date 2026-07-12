import { normalizeListOptions } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../auth/useAuthorization';
import { useAlgolia } from '../hooks/algolia';
import {
  getProject,
  getProjects,
  ProjectListOptions,
  putProjectResources,
} from './api';

export const projectQueryKeys = {
  all: ['projects'] as const,
  lists: () => [...projectQueryKeys.all, 'list'] as const,
  list: (options: ProjectListOptions) =>
    [...projectQueryKeys.lists(), normalizeListOptions(options)] as const,
  details: () => [...projectQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectQueryKeys.details(), id] as const,
};

export const useProjects = (
  options: ProjectListOptions,
): gp2.ListProjectResponse => {
  const { client } = useAlgolia();
  return useSuspenseQuery({
    queryKey: projectQueryKeys.list(options),
    queryFn: async (): Promise<gp2.ListProjectResponse> => {
      try {
        const data = await getProjects(client, options);
        return {
          total: data.nbHits ?? 0,
          items: data.hits,
          algoliaQueryId: data.queryID,
          algoliaIndexName: data.index,
        };
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

export const useProjectById = (id: string): gp2.ProjectResponse | undefined => {
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

export const usePutProjectResources = (id: string) => {
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  return async (payload: gp2.ProjectResourcesPutRequest) => {
    const project = await putProjectResources(
      id,
      payload,
      await getAuthorization(),
    );
    // Write the mutation response straight into the detail cache, never
    // refetch.
    queryClient.setQueryData(projectQueryKeys.detail(project.id), project);
    // Mark lists stale without refetching now: search indexing lags the
    // mutation, so an immediate refetch would cache pre-mutation results.
    void queryClient.invalidateQueries({
      queryKey: projectQueryKeys.lists(),
      refetchType: 'none',
    });
  };
};
