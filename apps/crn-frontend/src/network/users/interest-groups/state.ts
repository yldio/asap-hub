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
    queryFn: async (): Promise<ListInterestGroupResponse | 'noSuchUser'> => {
      try {
        const interestGroups = await getUserInterestGroups(
          userId,
          await getAuthorization(),
        );
        if (interestGroups === undefined) {
          return 'noSuchUser';
        }
        // Write-through into the shared interest-group entity store (R10):
        // the recoil selector fanned the fetched entities into
        // interest-groups' interestGroupState (the detail atom, unlike the
        // teams variant), seeding/refreshing the detail cache per group.
        interestGroups.items.forEach((group) => {
          queryClient.setQueryData(
            interestGroupQueryKeys.detail(group.id),
            group,
          );
        });
        return interestGroups;
      } catch (error) {
        // Preserved from the recoil hook's `.catch(setUserInterestGroups)`:
        // an Error rejection was cached and re-thrown to the error boundary,
        // while a non-Error rejection was swallowed. Map non-Errors to an
        // empty list.
        if (error instanceof Error) {
          throw error;
        }
        return { total: 0, items: [] };
      }
    },
  }).data;
};
