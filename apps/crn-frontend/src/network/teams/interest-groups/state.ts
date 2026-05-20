import { ListInterestGroupResponse } from '@asap-hub/model';
import { useAuth0CRN } from '@asap-hub/react-context';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getTeamInterestGroups } from './api';

export const teamInterestGroupsQueryKey = (teamId: string) =>
  ['interest-groups', 'by-team', teamId] as const;

export type TeamInterestGroupsResult = ListInterestGroupResponse | 'noSuchTeam';

export const useTeamInterestGroupsById = (
  teamId: string,
): TeamInterestGroupsResult => {
  const auth0 = useAuth0CRN();
  const { data } = useSuspenseQuery({
    queryKey: teamInterestGroupsQueryKey(teamId),
    queryFn: async (): Promise<TeamInterestGroupsResult> => {
      const token = await auth0.getTokenSilently();
      const result = await getTeamInterestGroups(teamId, `Bearer ${token}`);
      return result ?? 'noSuchTeam';
    },
  });
  return data;
};
