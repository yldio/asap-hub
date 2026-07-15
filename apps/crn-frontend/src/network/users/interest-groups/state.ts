import { withEmptyListFallback } from '@asap-hub/frontend-utils';
import { ListInterestGroupResponse } from '@asap-hub/model';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../../../auth/useAuthorization';
import { interestGroupQueryKeys } from '../../interest-groups/state';
import { getUserInterestGroups } from './api';

export const userInterestGroupQueryKeys = {
  all: ['user-interest-groups'] as const,
  byUser: (userId: string) =>
    [...userInterestGroupQueryKeys.all, userId] as const,
};

export const useUserInterestGroupsById = (
  userId: string,
): ListInterestGroupResponse | 'noSuchUser' => {
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  return useSuspenseQuery({
    queryKey: userInterestGroupQueryKeys.byUser(userId),
    queryFn: (): Promise<ListInterestGroupResponse | 'noSuchUser'> =>
      withEmptyListFallback<ListInterestGroupResponse | 'noSuchUser'>(
        async () => {
          const interestGroups = await getUserInterestGroups(
            userId,
            await getAuthorization(),
          );
          if (interestGroups === undefined) {
            return 'noSuchUser';
          }
          // Write-through into the shared interest-group entity store,
          // seeding/refreshing the detail cache per group.
          interestGroups.items.forEach((group) => {
            queryClient.setQueryData(
              interestGroupQueryKeys.detail(group.id),
              group,
            );
          });
          return interestGroups;
        },
        { total: 0, items: [] },
      ),
  }).data;
};
