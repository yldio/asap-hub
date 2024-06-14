import { PerformanceMetrics } from '@asap-hub/model';
import { aboveAverageIcon, averageIcon, belowAverageIcon } from '../icons';

export const getPerformanceIcon = (
  value: number,
  performanceMetrics: PerformanceMetrics,
) => {
  if (value <= performanceMetrics.belowAverageMax) {
    return belowAverageIcon;
  }

  if (
    value >= performanceMetrics.averageMin &&
    value <= performanceMetrics.averageMax
  ) {
    return averageIcon;
  }

  return aboveAverageIcon;
};

export const getPerformanceText = (
  value: number,
  performanceMetrics: PerformanceMetrics,
) => {
  if (value <= performanceMetrics.belowAverageMax) {
    return 'Below';
  }

  if (
    value >= performanceMetrics.averageMin &&
    value <= performanceMetrics.averageMax
  ) {
    return 'Average';
  }

  return 'Above';
};
