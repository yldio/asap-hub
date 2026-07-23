import {
  createQueryKeys,
  GetListOptions,
  nullOnUndefined,
  withEmptyListFallback,
} from '@asap-hub/frontend-utils';
import {
  WorkingGroupListResponse,
  WorkingGroupResponse,
} from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../../auth/useAuthorization';
import { useAlgolia } from '../../hooks/algolia';
import { getWorkingGroup, getWorkingGroups } from './api';

export const workingGroupQueryKeys =
  createQueryKeys<GetListOptions>('working-groups');

export const useWorkingGroupById = (
  id: string,
): WorkingGroupResponse | undefined => {
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

export const useWorkingGroups = (
  options: GetListOptions,
): WorkingGroupListResponse => {
  const algoliaClient = useAlgolia();
  return useSuspenseQuery({
    queryKey: workingGroupQueryKeys.list(options),
    queryFn: (): Promise<WorkingGroupListResponse> =>
      withEmptyListFallback(
        () => getWorkingGroups(algoliaClient.client, options),
        { total: 0, items: [] },
      ),
  }).data;
};
