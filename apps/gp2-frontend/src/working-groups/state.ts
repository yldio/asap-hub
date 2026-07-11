import { gp2 } from '@asap-hub/model';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../auth/useAuthorization';
import {
  getWorkingGroup,
  getWorkingGroupNetwork,
  getWorkingGroups,
  putWorkingGroupResources,
} from './api';

export const workingGroupQueryKeys = {
  all: ['working-groups'] as const,
  lists: () => [...workingGroupQueryKeys.all, 'list'] as const,
  details: () => [...workingGroupQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...workingGroupQueryKeys.details(), id] as const,
  network: () => [...workingGroupQueryKeys.all, 'network'] as const,
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
    // getWorkingGroup resolves undefined on a 404, but a queryFn must not
    // return undefined — cache null and map it back below.
    queryFn: async () =>
      (await getWorkingGroup(id, await getAuthorization())) ?? null,
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
  return async (payload: gp2.WorkingGroupResourcesPutRequest) => {
    const workingGroup = await putWorkingGroupResources(
      id,
      payload,
      await getAuthorization(),
    );
    // R3 patched-overlay: the recoil hook set the mutation response straight
    // into `workingGroupState(id)` (the detail atom the read hook returns) —
    // write it into the detail cache, never refetch (§6.1).
    queryClient.setQueryData(
      workingGroupQueryKeys.detail(workingGroup.id),
      workingGroup,
    );
    // SANCTIONED BEHAVIOR CHANGE (§6.1 / R5): both recoil refresh counters
    // were broken — `refreshWorkingGroupNetworkState` was bumped here but the
    // network selector never read it, and `refreshWorkingGroupsState` was read
    // by the list selector but never bumped anywhere. Wire up the invalidation
    // the code clearly intended: a resource change now refreshes the network
    // view and the working-groups list.
    await queryClient.invalidateQueries({
      queryKey: workingGroupQueryKeys.network(),
    });
    await queryClient.invalidateQueries({
      queryKey: workingGroupQueryKeys.lists(),
    });
  };
};
