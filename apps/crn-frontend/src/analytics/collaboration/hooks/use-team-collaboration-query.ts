import { useQuery } from '@tanstack/react-query';
import { SortTeamCollaboration } from '@asap-hub/model';
import { AnalyticsSearchOptionsWithFiltering } from '@asap-hub/algolia';
import { getTeamCollaboration } from '../api';
import { useAnalyticsAlgolia } from '../../../hooks/algolia';
import { getAlgoliaIndexName } from '../../utils/state';

export const useTeamCollaborationQuery = (
  options: AnalyticsSearchOptionsWithFiltering<SortTeamCollaboration>,
) => {
  const indexName = getAlgoliaIndexName(options.sort, 'team-collaboration');
  const algoliaClient = useAnalyticsAlgolia(indexName).client;

  return useQuery({
    queryKey: ['team-collaboration', options],
    queryFn: () => getTeamCollaboration(algoliaClient, options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
