import { useAuthorization } from '../auth/useAuthorization';
import { getTeams } from '../network/teams/api';

export const useTeamSuggestions = () => {
  const getAuthorization = useAuthorization();
  return async (searchQuery: string) =>
    getTeams(
      {
        searchQuery,
        status: [],
        currentPage: null,
        pageSize: null,
        teamType: 'all',
      },
      await getAuthorization(),
    ).then(({ items }) =>
      items.map(({ id, displayName }) => ({
        label: displayName,
        value: id,
      })),
    );
};
