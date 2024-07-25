import { AlgoliaClient } from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { ListEngagementAlgoliaResponse } from '@asap-hub/model';

export type EngagementListOptions = Pick<
  GetListOptions,
  'currentPage' | 'pageSize'
>;

export const getEngagement = async (
  algoliaClient: AlgoliaClient<'analytics'>,
  options: EngagementListOptions,
): Promise<ListEngagementAlgoliaResponse> => {
  const { currentPage, pageSize } = options;
  const result = await algoliaClient.search(['engagement'], '', {
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
