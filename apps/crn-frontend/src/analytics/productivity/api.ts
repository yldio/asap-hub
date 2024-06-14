import { AlgoliaClient } from '@asap-hub/algolia';
import {
  ListTeamProductivityAlgoliaResponse,
  ListUserProductivityAlgoliaResponse,
  TeamProductivityPerformance,
  SortTeamProductivity,
  SortUserProductivity,
  TimeRangeOption,
  UserProductivityPerformance,
} from '@asap-hub/model';
import { AnalyticsSearchOptions } from '../leadership/api';

export type ProductivityListOptions = Pick<
  AnalyticsSearchOptions,
  'currentPage' | 'pageSize' | 'tags'
> & {
  timeRange: TimeRangeOption;
  sort: SortUserProductivity | SortTeamProductivity;
};

export const getUserProductivity = async (
  algoliaClient: AlgoliaClient<'analytics'>,
  options: ProductivityListOptions,
): Promise<ListUserProductivityAlgoliaResponse | undefined> => {
  const { currentPage, pageSize, timeRange, tags } = options;
  const rangeFilter = `__meta.range:"${timeRange || '30d'}"`;
  const result = await algoliaClient.search(['user-productivity'], '', {
    tagFilters: [tags],
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

export const getUserProductivityPerformance = async (
  algoliaClient: AlgoliaClient<'analytics'>,
  timeRange: TimeRangeOption,
): Promise<UserProductivityPerformance | undefined> => {
  const rangeFilter = `__meta.range:"${timeRange || '30d'}"`;
  const result = await algoliaClient.search(
    ['user-productivity-performance'],
    '',
    {
      filters: rangeFilter,
    },
  );
  return result.hits[0];
};

export const getTeamProductivityPerformance = async (
  algoliaClient: AlgoliaClient<'analytics'>,
  timeRange: TimeRangeOption,
): Promise<TeamProductivityPerformance | undefined> => {
  const rangeFilter = `__meta.range:"${timeRange || '30d'}"`;
  const result = await algoliaClient.search(
    ['team-productivity-performance'],
    '',
    {
      filters: rangeFilter,
    },
  );
  return result.hits[0];
};

export const getTeamProductivity = async (
  algoliaClient: AlgoliaClient<'analytics'>,
  options: ProductivityListOptions,
): Promise<ListTeamProductivityAlgoliaResponse | undefined> => {
  const { currentPage, pageSize, timeRange, tags } = options;
  const rangeFilter = `__meta.range:"${timeRange || '30d'}"`;
  const result = await algoliaClient.search(['team-productivity'], '', {
    tagFilters: [tags],
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
