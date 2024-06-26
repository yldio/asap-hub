import {
  TimeRangeOption,
  DocumentCategoryOption,
  OutputTypeOption,
} from '@asap-hub/model';
import { AlgoliaClient } from '..';
import { AnalyticPerformanceType, AnalyticType } from './types';

export type AnalyticsSearchOptions = {
  currentPage: number | null;
  pageSize: number | null;
  tags: string[];
};

export type AnalyticsSearchOptionsWithFiltering<Sort = string> =
  AnalyticsSearchOptions & {
    timeRange: TimeRangeOption;
    sort: Sort;
    documentCategory?: DocumentCategoryOption;
    outputType?: OutputTypeOption;
  };

export type AnalyticsPerformanceOptions = Pick<
  AnalyticsSearchOptionsWithFiltering,
  'timeRange' | 'documentCategory' | 'outputType'
>;

export const getPerformanceForMetric =
  <T>(key: AnalyticPerformanceType) =>
  async (
    algoliaClient: AlgoliaClient<'analytics'>,
    options: AnalyticsPerformanceOptions,
  ): Promise<T | undefined> => {
    const { timeRange, documentCategory, outputType } = options;
    const rangeFilter = `__meta.range:"${timeRange || '30d'}"`;
    const documentCategoryFilter = `__meta.documentCategory:"${
      documentCategory || 'all'
    }"`;
    const outputTypeFilter = `__meta.outputType:"${outputType || 'all'}"`;
    const filters = `(${rangeFilter})${
      documentCategory ? ` AND (${documentCategoryFilter})` : ''
    }${options.outputType ? ` AND (${outputTypeFilter})` : ''}`;

    const result = await algoliaClient.search(
      [key as AnalyticPerformanceType],
      '',
      {
        filters,
      },
    );
    return result.hits[0] as T | undefined;
  };

export const getMetric =
  <T, Sort = string>(key: AnalyticType) =>
  async (
    algoliaClient: AlgoliaClient<'analytics'>,
    options: AnalyticsSearchOptionsWithFiltering<Sort>,
  ): Promise<T | undefined> => {
    const { currentPage, pageSize, timeRange, tags, documentCategory } =
      options;
    const rangeFilter = `__meta.range:"${timeRange || '30d'}"`;
    const documentCategoryFilter = `__meta.documentCategory:"${
      documentCategory || 'all'
    }"`;
    const outputTypeFilter = `__meta.outputType:"${
      options.outputType || 'all'
    }"`;
    const filters = `(${rangeFilter})${
      documentCategory ? ` AND (${documentCategoryFilter})` : ''
    }${options.outputType ? ` AND (${outputTypeFilter})` : ''}`;

    const result = await algoliaClient.search([key], '', {
      tagFilters: [tags],
      filters,
      page: currentPage ?? undefined,
      hitsPerPage: pageSize ?? undefined,
    });
    return {
      items: result.hits,
      total: result.nbHits,
      algoliaIndexName: result.index,
      algoliaQueryId: result.queryID,
    } as T | undefined;
  };
