import { useAuth0CRN } from '@asap-hub/react-context';
import { getLabs } from '../network/teams/api';

export const useLabSuggestions = () => {
  const auth0 = useAuth0CRN();
  return async (searchQuery: string) => {
    const token = await auth0.getTokenSilently();
    const { items } = await getLabs(
      { searchQuery, filters: new Set(), currentPage: null, pageSize: null },
      `Bearer ${token}`,
    );
    return items.map(({ id, name, labPITeamIds }) => ({
      label: `${name} Lab`,
      value: id,
      labPITeamIds,
    }));
  };
};
