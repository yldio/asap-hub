import {
  createQueryKeys,
  GetListOptions,
  nullOnUndefined,
} from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { useAuthorization } from '../auth/useAuthorization';
import {
  getWorkingGroup,
  getWorkingGroupNetwork,
  getWorkingGroups,
  putWorkingGroupResources,
} from './api';

export const workingGroupQueryKeys = {
  ...createQueryKeys<GetListOptions>('working-groups'),
  network: () => ['working-groups', 'network'] as const,
};

export const useWorkingGroupNetworkState =
  (): gp2.ListWorkingGroupNetworkResponse => {
    const getAuthorization = useAuthorization();
    return useSuspenseQuery({
      queryKey: workingGroupQueryKeys.network(),
      queryFn: async () => getWorkingGroupNetwork(await getAuthorization()),
    }).data;
  };

export const useWorkingGroupById = (
  id: string,
): gp2.WorkingGroupResponse | undefined => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: workingGroupQueryKeys.detail(id),
    queryFn: () =>
      nullOnUndefined(async () =>
        getWorkingGroup(id, await getAuthorization()),
      ),
  });
  return data ?? undefined;
};

export const useWorkingGroupsState = (): gp2.ListWorkingGroupResponse => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: workingGroupQueryKeys.lists(),
    queryFn: async () => getWorkingGroups(await getAuthorization()),
  }).data;
};

export const usePutWorkingGroupResources = (id: string) => {
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (payload: gp2.WorkingGroupResourcesPutRequest) =>
      putWorkingGroupResources(id, payload, await getAuthorization()),
    onSuccess: (workingGroup) => {
      // Write the mutation response straight into the detail cache, never
      // refetch.
      queryClient.setQueryData(
        workingGroupQueryKeys.detail(workingGroup.id),
        workingGroup,
      );
      // Mark the network view and lists stale without refetching now: search
      // indexing lags the mutation, so an immediate refetch would cache
      // pre-mutation results.
      void queryClient.invalidateQueries({
        queryKey: workingGroupQueryKeys.network(),
        refetchType: 'none',
      });
      void queryClient.invalidateQueries({
        queryKey: workingGroupQueryKeys.lists(),
        refetchType: 'none',
      });
    },
  });
  return async (payload: gp2.WorkingGroupResourcesPutRequest) => {
    await mutateAsync(payload);
  };
};
