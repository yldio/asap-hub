import { AlgoliaClient } from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  ListTeamProductivityAlgoliaResponse,
  ListUserProductivityAlgoliaResponse,
  TimeRangeOption,
} from '@asap-hub/model';

export type ProductivityListOptions = Pick<
  GetListOptions,
  'currentPage' | 'pageSize'
> & {
  timeRange: TimeRangeOption;
};

export const getUserProductivity = async (
  algoliaClient: AlgoliaClient<'analytics'>,
  options: ProductivityListOptions,
): Promise<ListUserProductivityAlgoliaResponse | undefined> => {
  const { currentPage, pageSize, timeRange } = options;
  const rangeFilter = `__meta.range:"${timeRange || '30d'}"`;
  const result = await algoliaClient.search(['user-productivity'], '', {
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

export const getTeamProductivity = async (
  algoliaClient: AlgoliaClient<'analytics'>,
  options: ProductivityListOptions,
): Promise<ListTeamProductivityAlgoliaResponse | undefined> => {
  const { currentPage, pageSize, timeRange } = options;
  const rangeFilter = `__meta.range:"${timeRange || '30d'}"`;
  const result = await algoliaClient.search(['team-productivity'], '', {
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
