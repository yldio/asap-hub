import {
  createQueryKeys,
  GetListOptions,
  nullOnUndefined,
  withEmptyListFallback,
} from '@asap-hub/frontend-utils';
import {
  InterestGroupResponse,
  ListInterestGroupResponse,
} from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../../auth/useAuthorization';
import { getInterestGroup, getInterestGroups } from './api';

// This module is the shared interest-group entity store: the teams and users
// interest-group modules write fetched entities into these keys.
export const interestGroupQueryKeys =
  createQueryKeys<GetListOptions>('interest-groups');

export const useInterestGroups = (
  options: GetListOptions,
): ListInterestGroupResponse => {
  const getAuthorization = useAuthorization();
  return useSuspenseQuery({
    queryKey: interestGroupQueryKeys.list(options),
    queryFn: (): Promise<ListInterestGroupResponse> =>
      withEmptyListFallback(
        async () => getInterestGroups(options, await getAuthorization()),
        { total: 0, items: [] },
      ),
  }).data;
};

export const useInterestGroupById = (
  id: string,
): InterestGroupResponse | undefined => {
  const getAuthorization = useAuthorization();
  const { data } = useSuspenseQuery({
    queryKey: interestGroupQueryKeys.detail(id),
    queryFn: () =>
      nullOnUndefined(async () =>
        getInterestGroup(id, await getAuthorization()),
      ),
  });
  return data ?? undefined;
};
