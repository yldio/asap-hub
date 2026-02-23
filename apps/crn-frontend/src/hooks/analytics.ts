import {
  DocumentCategoryOption,
  OutputTypeOption,
  TimeRangeOption,
} from '@asap-hub/model';
import { useLocation } from 'react-router';

type UseAnalyticsOptions = {
  defaultTimeRange?: TimeRangeOption;
};

export const useAnalytics = (options: UseAnalyticsOptions = {}) => {
  const { defaultTimeRange = 'all' } = options;
  const currentUrlParams = new URLSearchParams(useLocation().search);
  const rangeParam = currentUrlParams.get('range');
  const documentCategoryParam = currentUrlParams.get('documentCategory');
  const outputTypeParam = currentUrlParams.get('outputType');

  const timeRange = rangeParam
    ? (rangeParam as TimeRangeOption)
    : defaultTimeRange;
  const documentCategory = documentCategoryParam
    ? (documentCategoryParam as DocumentCategoryOption)
    : 'all';
  const outputType = outputTypeParam
    ? (outputTypeParam as OutputTypeOption)
    : 'all';

  return {
    timeRange,
    documentCategory,
    outputType,
  };
};
