import { PerformanceMetrics } from '@asap-hub/model';
import { getPerformanceText } from '../analytics';

describe('getPerformanceText ', () => {
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
});
