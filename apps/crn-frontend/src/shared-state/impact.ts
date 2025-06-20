import { useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getImpacts } from '../shared-api/impact';

export const useImpactSuggestions = () => {
  const authorization = useRecoilValue(authorizationState);
  return (searchQuery: string) =>
    getImpacts({ search: searchQuery }, authorization).then(({ items }) =>
      items.map(({ id, name }) => ({
        label: name,
        value: id,
      })),
    );
};
