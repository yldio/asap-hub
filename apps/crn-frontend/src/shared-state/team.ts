import { useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getTeams } from '../network/teams/api';

export const useTeamSuggestions = () => {
  const authorization = useRecoilValue(authorizationState);
  return (searchQuery: string) =>
    getTeams(
      { searchQuery, filters: new Set(), currentPage: null, pageSize: null },
      authorization,
    ).then(({ items }) =>
      items.map(({ id, displayName }) => ({
        label: displayName,
        value: id,
      })),
    );
};
