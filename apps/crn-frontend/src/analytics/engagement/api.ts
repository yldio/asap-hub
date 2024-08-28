import {
  AlgoliaClient,
  AnalyticsSearchOptions,
  ENGAGEMENT_PERFORMANCE,
} from '@asap-hub/algolia';
import { ListEngagementAlgoliaResponse } from '@asap-hub/model';

export type EngagementListOptions = Pick<
  AnalyticsSearchOptions,
  'currentPage' | 'pageSize' | 'tags'
>;

export const getEngagement = async (
  algoliaClient: AlgoliaClient<'analytics'>,
  options: EngagementListOptions,
): Promise<ListEngagementAlgoliaResponse> => {
  const { currentPage, pageSize, tags } = options;
  const result = await algoliaClient.search(['engagement'], '', {
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

export const getEngagementPerformance = async (
  algoliaClient: AlgoliaClient<'analytics'>,
) => {
  const result = await algoliaClient.search([ENGAGEMENT_PERFORMANCE], '', {});
  return result.hits[0];
};
