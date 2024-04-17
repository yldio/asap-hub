import { TimeRangeOption } from '@asap-hub/model';
import { useLocation } from 'react-router-dom';

export const useAnalytics = () => {
  const currentUrlParams = new URLSearchParams(useLocation().search);
  const rangeParam = currentUrlParams.get('range');
  const timeRange = rangeParam ? (rangeParam as TimeRangeOption) : '30d';

  return {
    timeRange,
  };
};
