import { PerformanceMetrics } from '@asap-hub/model';
import {
  aboveAverageIcon,
  averageIcon,
  belowAverageIcon,
  informationInverseIcon,
  happyFaceIcon,
  neutralFaceIcon,
  sadFaceIcon,
} from '../icons';

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

export const getPerformanceMoodIcon = (
  percentage: number | null,
  isLimitedData: boolean = false,
) => {
  if (isLimitedData || percentage === null) {
    return informationInverseIcon;
  }
  if (percentage >= 90) {
    return happyFaceIcon;
  }
  if (percentage >= 80) {
    return neutralFaceIcon;
  }
  return sadFaceIcon;
};
