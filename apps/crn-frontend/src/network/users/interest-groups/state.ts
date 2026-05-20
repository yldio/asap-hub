import { ListInterestGroupResponse } from '@asap-hub/model';
import { useAuth0CRN } from '@asap-hub/react-context';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getUserInterestGroups } from './api';

export const userInterestGroupsQueryKey = (userId: string) =>
  ['interest-groups', 'by-user', userId] as const;

export type UserInterestGroupsResult = ListInterestGroupResponse | 'noSuchUser';

export const useUserInterestGroupsById = (
  userId: string,
): UserInterestGroupsResult => {
  const auth0 = useAuth0CRN();
  const { data } = useSuspenseQuery({
    queryKey: userInterestGroupsQueryKey(userId),
    queryFn: async (): Promise<UserInterestGroupsResult> => {
      const token = await auth0.getTokenSilently();
      const result = await getUserInterestGroups(userId, `Bearer ${token}`);
      return result ?? 'noSuchUser';
    },
  });
  return data;
};
