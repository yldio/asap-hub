import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  WorkingGroupListResponse,
  WorkingGroupResponse,
} from '@asap-hub/model';
import { useAuth0CRN } from '@asap-hub/react-context';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { useAlgolia } from '../../hooks/algolia';
import { getWorkingGroup, getWorkingGroups } from './api';

export const workingGroupsListQueryKey = (options: GetListOptions) =>
  ['working-groups', 'list', options] as const;

export const workingGroupQueryKey = (id: string) =>
  ['working-groups', 'item', id] as const;

export const useWorkingGroups = (
  options: GetListOptions,
): WorkingGroupListResponse => {
  const { client } = useAlgolia();
  const { data } = useSuspenseQuery({
    queryKey: workingGroupsListQueryKey(options),
    queryFn: () => getWorkingGroups(client, options),
  });
  return data;
};

export const useWorkingGroupById = (
  id: string,
): WorkingGroupResponse | undefined => {
  const auth0 = useAuth0CRN();
  const { data } = useSuspenseQuery({
    queryKey: workingGroupQueryKey(id),
    queryFn: async (): Promise<WorkingGroupResponse | null> => {
      const token = await auth0.getTokenSilently();
      const group = await getWorkingGroup(id, `Bearer ${token}`);
      return group ?? null;
    },
  });
  return data ?? undefined;
};

export const usePrefetchWorkingGroups = (options: GetListOptions) => {
  const { client } = useAlgolia();
  const queryClient = useQueryClient();

  useDeepCompareEffect(() => {
    const key = workingGroupsListQueryKey(options);
    if (queryClient.getQueryData(key) !== undefined) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    queryClient.prefetchQuery({
      queryKey: key,
      queryFn: () => getWorkingGroups(client, options),
    });
  }, [options, client, queryClient]);
};
