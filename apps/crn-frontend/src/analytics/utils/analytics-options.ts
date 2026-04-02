import {
  TimeRangeOption,
  DocumentCategoryOption,
  OutputTypeOption,
} from '@asap-hub/model';

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
