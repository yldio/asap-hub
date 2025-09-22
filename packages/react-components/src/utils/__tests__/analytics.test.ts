import { PerformanceMetrics } from '@asap-hub/model';
import {
  happyFaceIcon,
  neutralFaceIcon,
  sadFaceIcon,
  informationInverseIcon,
} from '../../icons';
import { getPerformanceText, getPrelimPerformanceIcon } from '../analytics';

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
    expect(getPrelimPerformanceIcon(95, false)).toBe(happyFaceIcon);
    expect(getPrelimPerformanceIcon(90, false)).toBe(happyFaceIcon);
    expect(getPrelimPerformanceIcon(85, false)).toBe(neutralFaceIcon);
    expect(getPrelimPerformanceIcon(80, false)).toBe(neutralFaceIcon);
    expect(getPrelimPerformanceIcon(50, false)).toBe(sadFaceIcon);
    expect(getPrelimPerformanceIcon(1, false)).toBe(sadFaceIcon);
    expect(getPrelimPerformanceIcon(0, false)).toBe(sadFaceIcon);
    expect(getPrelimPerformanceIcon(0, true)).toBe(informationInverseIcon);
    expect(getPrelimPerformanceIcon(null, true)).toBe(informationInverseIcon);
    expect(getPrelimPerformanceIcon(null, false)).toBe(informationInverseIcon);
  });
});
