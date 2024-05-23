import { AlgoliaClient } from '@asap-hub/algolia';
import { ListAnalyticsTeamLeadershipResponse } from '@asap-hub/model';

export type AnalyticsSearchOptions = {
  currentPage: number | null;
  pageSize: number | null;
  tags: string[];
}

export const getAnalyticsLeadership = async (
  algoliaClient: AlgoliaClient<'analytics'>,
  { tags, currentPage, pageSize }: AnalyticsSearchOptions,
): Promise<ListAnalyticsTeamLeadershipResponse | undefined> => {

  const result = await algoliaClient.search(['team-leadership'], '', {
    tagFilters: [tags],
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
