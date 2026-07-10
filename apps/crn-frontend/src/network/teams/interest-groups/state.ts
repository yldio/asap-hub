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
    queryFn: async (): Promise<ListInterestGroupResponse | 'noSuchTeam'> => {
      try {
        const interestGroups = await getTeamInterestGroups(
          teamId,
          await getAuthorization(),
        );
        if (interestGroups === undefined) {
          return 'noSuchTeam';
        }
        // Write-through into the shared interest-group entity store (R10):
        // the recoil selector fanned the fetched entities into
        // interest-groups' interestGroupListState, updating any cached
        // interest-group list that contains them.
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
      } catch (error) {
        // Preserved from the recoil hook's `.catch(setTeamInterestGroups)`:
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
