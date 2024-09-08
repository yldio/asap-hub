import { AlgoliaClient, AnalyticsSearchOptions } from '@asap-hub/algolia';
import {
  ListEngagementAlgoliaResponse,
  TimeRangeOption,
} from '@asap-hub/model';

export type EngagementListOptions = Pick<
  AnalyticsSearchOptions,
  'currentPage' | 'pageSize' | 'tags'
> & {
  timeRange: TimeRangeOption;
};

export const getEngagement = async (
  algoliaClient: AlgoliaClient<'analytics'>,
  options: EngagementListOptions,
): Promise<ListEngagementAlgoliaResponse> => {
  const { currentPage, pageSize, tags, timeRange } = options;
  const result = await algoliaClient.search(['engagement'], '', {
    filters: `(__meta.range:"${timeRange || 'all'}")`,
    tagFilters: [tags],
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
