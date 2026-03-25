import { useAuth0CRN } from '@asap-hub/react-context';
import { getImpacts } from '../shared-api/impact';

export const useImpactSuggestions = () => {
  const auth0 = useAuth0CRN();
  return async (searchQuery: string) => {
    const token = await auth0.getTokenSilently();
    const { items } = await getImpacts(
      { search: searchQuery, take: 1000 },
      `Bearer ${token}`,
    );
    return items.map(({ id, name }) => ({
      label: name,
      value: id,
    }));
  };
};
