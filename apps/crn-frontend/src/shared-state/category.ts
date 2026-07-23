import { useAuthorization } from '../auth/useAuthorization';
import { getCategories } from '../shared-api/category';

export const useCategorySuggestions = () => {
  const getAuthorization = useAuthorization();
  return async (searchQuery: string) =>
    getCategories(
      { search: searchQuery, take: 1000 },
      await getAuthorization(),
    ).then(({ items }) =>
      items.map(({ id, name }) => ({
        label: name,
        value: id,
      })),
    );
};
