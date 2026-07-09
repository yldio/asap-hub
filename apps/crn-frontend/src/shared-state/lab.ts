import { useAuthorization } from '../auth/useAuthorization';
import { getLabs } from '../network/teams/api';

export const useLabSuggestions = () => {
  const getAuthorization = useAuthorization();
  return async (searchQuery: string) =>
    getLabs(
      { searchQuery, filters: new Set(), currentPage: null, pageSize: null },
      await getAuthorization(),
    ).then(({ items }) =>
      items.map(({ id, name, labPITeamIds, labPrincipalInvestigatorId }) => ({
        label: `${name} Lab`,
        value: id,
        labPITeamIds,
        labPrincipalInvestigatorId,
      })),
    );
};
