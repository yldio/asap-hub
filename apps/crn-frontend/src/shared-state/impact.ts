import { useCallback } from 'react';
import { useAuthorization } from '../auth/useAuthorization';
import { getImpacts } from '../shared-api/impact';

export const useImpactSuggestions = () => {
  const getAuthorization = useAuthorization();
  return useCallback(
    async (searchQuery: string) =>
      getImpacts(
        { search: searchQuery, take: 1000 },
        await getAuthorization(),
      ).then(({ items }) =>
        items.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
      ),
    [getAuthorization],
  );
};
