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

const FLAGGED_ANALYTICS = [
  'os-champion',
  'sharing-prelim-findings',
  'attendance',
];

export const removeFlaggedOptions = (isFlagEnabled: boolean, option: string) =>
  isFlagEnabled || !FLAGGED_ANALYTICS.includes(option);

export const getPrelimPerformanceIcon = (percentage: number) => {
  if (percentage >= 90) {
    return happyFaceIcon;
  }
  if (percentage >= 80) {
    return neutralFaceIcon;
  }
  if (percentage > 0) {
    return sadFaceIcon;
  }
  return informationInverseIcon;
};
