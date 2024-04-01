import { AlgoliaClient } from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { ListAnalyticsTeamLeadershipResponse } from '@asap-hub/model';

export const getAnalyticsLeadership = async (
  algoliaClient: AlgoliaClient<'analytics'>,
  { searchQuery, filters, currentPage, pageSize }: GetListOptions,
): Promise<ListAnalyticsTeamLeadershipResponse | undefined> => {
  const result = await algoliaClient.search(['team-leadership'], searchQuery, {
    filters: undefined,
    page: currentPage ?? undefined,
    hitsPerPage: pageSize ?? undefined,
  });

  return {
    items: result.hits,
    total: result.nbHits,
    algoliaIndexName: result.index,
    algoliaQueryId: result.queryID,
  };
};
