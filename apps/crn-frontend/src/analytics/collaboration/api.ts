import { AlgoliaClient } from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { TimeRangeOption } from '@asap-hub/model';

export type CollaborationListOptions = Pick<
  GetListOptions,
  'currentPage' | 'pageSize'
> & {
  timeRange: TimeRangeOption;
};

export const getUserCollaboration = async (
  algoliaClient: AlgoliaClient<'analytics'>,
  options: CollaborationListOptions,
) => {
  const { currentPage, pageSize, timeRange } = options;
  const rangeFilter = `__meta.range:"${timeRange || '30d'}"`;
  const result = await algoliaClient.search(['user-collaboration'], '', {
    filters: rangeFilter,
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

export const getTeamCollaboration = async (
  algoliaClient: AlgoliaClient<'analytics'>,
  options: CollaborationListOptions,
) => {
  const { currentPage, pageSize, timeRange } = options;
  const rangeFilter = `__meta.range:"${timeRange || '30d'}"`;
  const result = await algoliaClient.search(['team-collaboration'], '', {
    filters: rangeFilter,
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
