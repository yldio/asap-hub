import { PerformanceMetrics } from '@asap-hub/model';
import {
  happyFaceIcon,
  neutralFaceIcon,
  sadFaceIcon,
  informationInverseIcon,
} from '../../icons';
import { getPerformanceText, getPerformanceMoodIcon } from '../analytics';

describe('getPerformanceText', () => {
  const performanceMetrics: PerformanceMetrics = {
    belowAverageMin: 0,
    belowAverageMax: 4,
    averageMin: 5,
    averageMax: 10,
    aboveAverageMin: 11,
    aboveAverageMax: 20,
  };
  it('returns "Below" when value is below average', () => {
    expect(getPerformanceText(3, performanceMetrics)).toBe('Below');
  });
  it('returns "Average" when value is within average', () => {
    expect(getPerformanceText(6, performanceMetrics)).toBe('Average');
  });
  it('returns "Above" when value is above average', () => {
    expect(getPerformanceText(15, performanceMetrics)).toBe('Above');
  });

  it('getPerformanceIcon returns correct icons for different percentages', () => {
    expect(getPerformanceMoodIcon(95, false)).toBe(happyFaceIcon);
    expect(getPerformanceMoodIcon(90, false)).toBe(happyFaceIcon);
    expect(getPerformanceMoodIcon(85, false)).toBe(neutralFaceIcon);
    expect(getPerformanceMoodIcon(80, false)).toBe(neutralFaceIcon);
    expect(getPerformanceMoodIcon(50, false)).toBe(sadFaceIcon);
    expect(getPerformanceMoodIcon(1, false)).toBe(sadFaceIcon);
    expect(getPerformanceMoodIcon(0, false)).toBe(sadFaceIcon);
    expect(getPerformanceMoodIcon(0, true)).toBe(informationInverseIcon);
    expect(getPerformanceMoodIcon(null, true)).toBe(informationInverseIcon);
    expect(getPerformanceMoodIcon(null, false)).toBe(informationInverseIcon);
  });
});
