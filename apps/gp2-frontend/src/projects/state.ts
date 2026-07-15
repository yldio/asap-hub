import {
  createQueryKeys,
  nullOnUndefined,
  withEmptyListFallback,
} from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { useAuthorization } from '../auth/useAuthorization';
import { useAlgolia } from '../hooks/algolia';
import {
  getProject,
  getProjects,
  ProjectListOptions,
  putProjectResources,
} from './api';

export const projectQueryKeys = createQueryKeys<ProjectListOptions>('projects');

export const useProjects = (
  options: ProjectListOptions,
): gp2.ListProjectResponse => {
  const { client } = useAlgolia();
  return useSuspenseQuery({
    queryKey: projectQueryKeys.list(options),
    queryFn: (): Promise<gp2.ListProjectResponse> =>
      withEmptyListFallback<gp2.ListProjectResponse>(
        async () => {
          const data = await getProjects(client, options);
          return {
            total: data.nbHits ?? 0,
            items: data.hits,
            algoliaQueryId: data.queryID,
            algoliaIndexName: data.index,
          };
        },
        { total: 0, items: [] },
      ),
  }).data;
};

export const useProjectById = (id: string): gp2.ProjectResponse | undefined => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: projectQueryKeys.detail(id),
    queryFn: () =>
      nullOnUndefined(async () => getProject(id, await getAuthorization())),
  });
  return data ?? undefined;
};

export const usePutProjectResources = (id: string) => {
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (payload: gp2.ProjectResourcesPutRequest) =>
      putProjectResources(id, payload, await getAuthorization()),
    onSuccess: (project) => {
      // Write the mutation response straight into the detail cache, never
      // refetch.
      queryClient.setQueryData(projectQueryKeys.detail(project.id), project);
      // Mark lists stale without refetching now: search indexing lags the
      // mutation, so an immediate refetch would cache pre-mutation results.
      void queryClient.invalidateQueries({
        queryKey: projectQueryKeys.lists(),
        refetchType: 'none',
      });
    },
  });
  return async (payload: gp2.ProjectResourcesPutRequest) => {
    await mutateAsync(payload);
  };
};
