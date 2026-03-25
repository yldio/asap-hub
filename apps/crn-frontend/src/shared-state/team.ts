import { useAuth0CRN } from '@asap-hub/react-context';
import { getTeams } from '../network/teams/api';

export const useTeamSuggestions = () => {
  const auth0 = useAuth0CRN();
  return async (searchQuery: string) => {
    const token = await auth0.getTokenSilently();
    const { items } = await getTeams(
      {
        searchQuery,
        filters: new Set(),
        currentPage: null,
        pageSize: null,
        teamType: 'all',
      },
      `Bearer ${token}`,
    );
    return items.map(({ id, displayName }) => ({
      label: displayName,
      value: id,
    }));
  };
};
