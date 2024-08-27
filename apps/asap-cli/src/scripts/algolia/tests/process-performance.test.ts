import { SearchResponse } from '@algolia/client-search';
import type { SearchIndex } from 'algoliasearch';

import {
  deletePreviousObjects,
  getAllHits,
  getPerformanceMetrics,
  getQuartiles,
} from '../process-performance';

describe('getQuartiles', () => {
  it('should return 0 values when data contains less than 4 values', () => {
    expect(getQuartiles([])).toEqual({ min: 0, q1: 0, q3: 0, max: 0 });
  });

  it('should return correct quartiles for an array of numbers', () => {
    const numbers = [
      20, 1, 3, 2, 5, 19, 14, 9, 18, 16, 11, 8, 12, 10, 4, 7, 13, 6, 15, 17,
    ];

    const quartiles = getQuartiles(numbers);
    expect(quartiles.min).toEqual(1);
    expect(quartiles.q1).toEqual(5.5);
    expect(quartiles.q3).toEqual(15.5);
    expect(quartiles.max).toEqual(20);
  });
});

describe('getPerformanceMetrics', () => {
  describe('when dataset is a list of integers', () => {
    it('sets below average and above average ranges to -1 when all values are the same', () => {
      const data = [6, 6, 6, 6, 6, 6];
      const metrics = getPerformanceMetrics(data);
      expect(metrics).toEqual({
        belowAverageMin: -1,
        belowAverageMax: -1,
        averageMin: 6,
        averageMax: 6,
        aboveAverageMin: -1,
        aboveAverageMax: -1,
      });
    });

    it('returns correct performance metrics when the data has a lot of zeros', () => {
      const data = [0, 1, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 1, 0, 0, 1, 2];
      const metrics = getPerformanceMetrics(data);
      expect(metrics).toEqual({
        belowAverageMin: 0,
        belowAverageMax: 0,
        averageMin: 1,
        averageMax: 1,
        aboveAverageMin: 2,
        aboveAverageMax: 2,
      });
    });

    it('sets below average max to rounded down first quartile when first quartile is decimal', () => {
      const data = [
        20, 1, 3, 2, 5, 19, 14, 9, 18, 16, 11, 8, 12, 10, 4, 7, 13, 6, 15, 17,
      ];
      const { q1 } = getQuartiles(data);

      expect(q1).toBe(5.5);
      const metrics = getPerformanceMetrics(data);
      expect(metrics.belowAverageMax).toBe(5);
    });

    it('sets average min to rounded up first quartile when first quartile is decimal', () => {
      const data = [
        20, 1, 3, 2, 5, 19, 14, 9, 18, 16, 11, 8, 12, 10, 4, 7, 13, 6, 15, 17,
      ];
      const { q1 } = getQuartiles(data);

      expect(q1).toBe(5.5);
      const metrics = getPerformanceMetrics(data);
      expect(metrics.averageMin).toBe(6);
    });

    it('sets average max to rounded down third quartile when third quartile is decimal', () => {
      const data = [
        20, 1, 3, 2, 5, 19, 14, 9, 18, 16, 11, 8, 12, 10, 4, 7, 13, 6, 15, 17,
      ];
      const { q3 } = getQuartiles(data);

      expect(q3).toBe(15.5);
      const metrics = getPerformanceMetrics(data);
      expect(metrics.averageMax).toBe(15);
    });

    it('sets above average min to rounded up third quartile when third quartile is decimal', () => {
      const data = [
        20, 1, 3, 2, 5, 19, 14, 9, 18, 16, 11, 8, 12, 10, 4, 7, 13, 6, 15, 17,
      ];
      const { q3 } = getQuartiles(data);

      expect(q3).toBe(15.5);
      const metrics = getPerformanceMetrics(data);
      expect(metrics.aboveAverageMin).toBe(16);
    });

    it('sets average min to first quartile when first quartile is integer', () => {
      const data = [
        20, 1, 3, 2, 19, 14, 9, 18, 16, 11, 8, 12, 10, 4, 13, 6, 15, 17,
      ];
      const { q1 } = getQuartiles(data);

      expect(q1).toBe(6);
      const metrics = getPerformanceMetrics(data);
      expect(metrics.averageMin).toBe(q1);
      expect(metrics.belowAverageMax).toBeLessThan(metrics.averageMin);
    });

    it('sets average max to third quartile when third quartile is integer', () => {
      const data = [
        20, 1, 3, 2, 19, 14, 9, 18, 16, 11, 8, 12, 10, 4, 13, 6, 15, 17,
      ];
      const { q3 } = getQuartiles(data);

      expect(q3).toBe(16);
      const metrics = getPerformanceMetrics(data);
      expect(metrics.averageMax).toBe(16);
      expect(metrics.averageMax).toBeLessThan(metrics.aboveAverageMin);
    });

    it('sets above average range to -1 when average max and above average max are the same', () => {
      const data = [2, 2, 2, 3, 4, 4, 4, 4];
      const { q3, max } = getQuartiles(data);

      expect(q3).toBe(max);
      const metrics = getPerformanceMetrics(data);
      expect(metrics.aboveAverageMin).toBe(-1);
      expect(metrics.aboveAverageMax).toBe(-1);
    });
  });

  describe('when dataset is a list of decimals', () => {
    it('sets below average and above average ranges to -1 when all values are the same', () => {
      const data = [6.75, 6.75, 6.75, 6.75, 6.75];
      const metrics = getPerformanceMetrics(data, false);
      expect(metrics).toEqual({
        belowAverageMin: -1,
        belowAverageMax: -1,
        averageMin: 6.75,
        averageMax: 6.75,
        aboveAverageMin: -1,
        aboveAverageMax: -1,
      });
    });

    it('average min is first quartile', () => {
      const data = [0.58, 0.46, 0.71, 0.32, 0.98, 0.01, 0.33, 0.88, 0.61, 0.41];
      const { q1 } = getQuartiles(data);

      expect(q1).toBe(0.33);
      const metrics = getPerformanceMetrics(data, false);
      expect(metrics.averageMin).toBe(q1);
      expect(metrics.belowAverageMax).toBeLessThan(metrics.averageMin);
    });

    it('average max is third quartile', () => {
      const data = [0.58, 0.46, 0.71, 0.32, 0.98, 0.01, 0.33, 0.88, 0.61, 0.41];
      const { q3 } = getQuartiles(data);

      expect(q3).toBe(0.71);
      const metrics = getPerformanceMetrics(data, false);
      expect(metrics.averageMax).toBe(q3);
      expect(metrics.averageMax).toBeLessThan(metrics.aboveAverageMin);
    });

    it('returns correct performance metrics when the data and result have decimal places', () => {
      const data = [0.58, 0.46, 0.71, 0.32, 0.98, 0.01, 0.33, 0.88, 0.61, 0.41];
      const metrics = getPerformanceMetrics(data, false);
      expect(metrics).toEqual({
        belowAverageMin: 0.01,
        belowAverageMax: 0.32,
        averageMin: 0.33,
        averageMax: 0.71,
        aboveAverageMin: 0.72,
        aboveAverageMax: 0.98,
      });
    });
  });
});

describe('getAllHits', () => {
  it('should retrieve all hits across multiple pages', async () => {
    const mockHits = Array.from({ length: 150 }, (_, i) => ({
      objectID: `${i}`,
    }));

    const mockGetPaginatedHits = jest.fn((page) => {
      const hitsPerPage = 50;
      return Promise.resolve({
        hits: mockHits.slice(page * hitsPerPage, (page + 1) * hitsPerPage),
        nbPages: 3,
      } as unknown as SearchResponse<(typeof mockHits)[0]>);
    });

    const allHits = await getAllHits(mockGetPaginatedHits);
    expect(allHits).toHaveLength(150);
    expect(mockGetPaginatedHits).toHaveBeenCalledTimes(3);
  });
});

describe('deletePreviousObjects', () => {
  it('should delete previous objects of specified type', async () => {
    const mockIndex = {
      search: jest.fn().mockResolvedValue({
        hits: [{ objectID: '1' }, { objectID: '2' }],
      }),
      deleteObjects: jest.fn().mockResolvedValue({}),
    } as unknown as SearchIndex;

    await deletePreviousObjects(mockIndex, 'user-productivity');
    expect(mockIndex.search).toHaveBeenCalledWith('', {
      filters: '__meta.type:"user-productivity-performance"',
    });
    expect(mockIndex.deleteObjects).toHaveBeenCalledWith(['1', '2']);
  });
});
