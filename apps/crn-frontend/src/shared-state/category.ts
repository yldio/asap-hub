import { useAuth0CRN } from '@asap-hub/react-context';
import { getCategories } from '../shared-api/category';

export const useCategorySuggestions = () => {
  const auth0 = useAuth0CRN();
  return async (searchQuery: string) => {
    const token = await auth0.getTokenSilently();
    const { items } = await getCategories(
      { search: searchQuery, take: 1000 },
      `Bearer ${token}`,
    );
    return items.map(({ id, name }) => ({
      label: name,
      value: id,
    }));
  };
};
