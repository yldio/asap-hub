import { AlgoliaClient } from '@asap-hub/algolia';
import { ListAnalyticsTeamLeadershipResponse } from '@asap-hub/model';
import { MetricOption } from '@asap-hub/react-components';

export type AnalyticsSearchOptions = {
  metric?: MetricOption;
  currentPage: number | null;
  pageSize: number | null;
  tags: string[];
};

export const getAnalyticsLeadership = async (
  algoliaClient: AlgoliaClient<'analytics'>,
  { metric, tags, currentPage, pageSize }: AnalyticsSearchOptions,
): Promise<ListAnalyticsTeamLeadershipResponse | undefined> => {
  if (metric === 'os-champion') {
    return {
      items: [],
      total: 0,
      algoliaIndexName: '',
      algoliaQueryId: '',
    };
  }
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
