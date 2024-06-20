import { DocumentCategoryOption, TimeRangeOption } from '@asap-hub/model';
import { useLocation } from 'react-router-dom';

export const useAnalytics = () => {
  const currentUrlParams = new URLSearchParams(useLocation().search);
  const rangeParam = currentUrlParams.get('range');
  const documentCategoryParam = currentUrlParams.get('documentCategory');
  const timeRange = rangeParam ? (rangeParam as TimeRangeOption) : '30d';
  const documentCategory = documentCategoryParam
    ? (documentCategoryParam as DocumentCategoryOption)
    : 'all';

  return {
    timeRange,
    documentCategory,
  };
};
