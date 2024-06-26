import { TimeRangeOption, DocumentCategoryOption } from '@asap-hub/model';
import { AlgoliaClient } from '..';
import { AnalyticPerformanceType, AnalyticType } from './types';

export type AnalyticsSearchOptions = {
  currentPage: number | null;
  pageSize: number | null;
  tags: string[];
};

export type AnalyticsSearchOptionsWithRange<Sort = string> =
  AnalyticsSearchOptions & {
    timeRange: TimeRangeOption;
    sort: Sort;
    documentCategory?: DocumentCategoryOption;
  };

export type AnalyticsPerformanceOptions = Pick<
  AnalyticsSearchOptionsWithRange,
  'timeRange' | 'documentCategory'
>;

export const getPerformanceForMetric =
  <T>(key: AnalyticPerformanceType) =>
  async (
    algoliaClient: AlgoliaClient<'analytics'>,
    options: AnalyticsPerformanceOptions,
  ): Promise<T | undefined> => {
    const { timeRange, documentCategory } = options;
    const rangeFilter = `__meta.range:"${timeRange || '30d'}"`;
    const documentCategoryFilter = `__meta.documentCategory:"${
      documentCategory || 'all'
    }"`;
    const filters = documentCategory
      ? `(${rangeFilter}) AND (${documentCategoryFilter})`
      : `(${rangeFilter})`;

    const result = await algoliaClient.search(
      [key as AnalyticPerformanceType as 'team-leadership'],
      '',
      {
        filters,
      },
    );
    return result.hits[0] as T | undefined;
  };

export const getMetricWithRange =
  <T, Sort = string>(key: AnalyticType) =>
  async (
    algoliaClient: AlgoliaClient<'analytics'>,
    options: AnalyticsSearchOptionsWithRange<Sort>,
  ): Promise<T | undefined> => {
    const { currentPage, pageSize, timeRange, tags, documentCategory } =
      options;
    const rangeFilter = `__meta.range:"${timeRange || '30d'}"`;
    const documentCategoryFilter = `__meta.documentCategory:"${
      documentCategory || 'all'
    }"`;
    const filters = `(${rangeFilter}) AND (${documentCategoryFilter})`;
    const result = await algoliaClient.search(
      [key as AnalyticType as 'user-productivity'],
      '',
      {
        tagFilters: [tags],
        filters,
        page: currentPage ?? undefined,
        hitsPerPage: pageSize ?? undefined,
      },
    );
    return {
      items: result.hits,
      total: result.nbHits,
      algoliaIndexName: result.index,
      algoliaQueryId: result.queryID,
    } as T | undefined;
  };
