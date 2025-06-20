import { useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getCategories } from '../shared-api/category';

export const useCategorySuggestions = () => {
  const authorization = useRecoilValue(authorizationState);
  return (searchQuery: string) =>
    getCategories({ search: searchQuery }, authorization).then(({ items }) =>
      items.map(({ id, name }) => ({
        label: name,
        value: id,
      })),
    );
};
