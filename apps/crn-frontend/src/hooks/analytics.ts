import { DocumentTypeOption, SharingStatusOption, TimeRangeOption } from '@asap-hub/model';
import { useLocation } from 'react-router-dom';

export const useAnalytics = () => {
  const currentUrlParams = new URLSearchParams(useLocation().search);
  const rangeParam = currentUrlParams.get('range');
  const documentCategoryParam = currentUrlParams.get('documentCategory');
  const typeParam = currentUrlParams.get('type');
  const timeRange = rangeParam ? (rangeParam as TimeRangeOption) : '30d';
  const documentCategory = documentCategoryParam ? (documentCategoryParam as DocumentTypeOption) : 'all';
  const type = typeParam ? (typeParam as SharingStatusOption) : 'all';

  return {
    timeRange,
    documentCategory,
    type,
  };
};
