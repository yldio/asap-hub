import { useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getLabs } from '../network/teams/api';

export const useLabSuggestions = () => {
  const authorization = useRecoilValue(authorizationState);
  return (searchQuery: string) =>
    getLabs(
      { searchQuery, filters: new Set(), currentPage: null, pageSize: null },
      authorization,
    ).then(({ items }) =>
      items.map(({ id, name }) => ({ label: `${name} Lab`, value: id })),
    );
};
