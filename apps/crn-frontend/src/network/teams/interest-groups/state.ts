import { withEmptyListFallback } from '@asap-hub/frontend-utils';
import { ListInterestGroupResponse } from '@asap-hub/model';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { useAuthorization } from '../../../auth/useAuthorization';
import { interestGroupQueryKeys } from '../../interest-groups/state';
import { getTeamInterestGroups } from './api';

export const teamInterestGroupQueryKeys = {
  all: ['team-interest-groups'] as const,
  byTeam: (teamId: string) =>
    [...teamInterestGroupQueryKeys.all, teamId] as const,
};

export const useTeamInterestGroupsById = (
  teamId: string,
): ListInterestGroupResponse | 'noSuchTeam' => {
  const getAuthorization = useAuthorization();
  const queryClient = useQueryClient();
  return useSuspenseQuery({
    queryKey: teamInterestGroupQueryKeys.byTeam(teamId),
    queryFn: (): Promise<ListInterestGroupResponse | 'noSuchTeam'> =>
      withEmptyListFallback<ListInterestGroupResponse | 'noSuchTeam'>(
        async () => {
          const interestGroups = await getTeamInterestGroups(
            teamId,
            await getAuthorization(),
          );
          if (interestGroups === undefined) {
            return 'noSuchTeam';
          }
          // Write-through into the shared interest-group entity store,
          // updating any cached interest-group list that contains them.
          const byId = new Map(
            interestGroups.items.map((group) => [group.id, group]),
          );
          queryClient.setQueriesData<ListInterestGroupResponse>(
            { queryKey: interestGroupQueryKeys.lists() },
            (cached) =>
              cached && {
                ...cached,
                items: cached.items.map((item) => byId.get(item.id) ?? item),
              },
          );
          return interestGroups;
        },
        { total: 0, items: [] },
      ),
  }).data;
};
