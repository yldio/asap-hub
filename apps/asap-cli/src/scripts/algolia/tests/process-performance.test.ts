import { SearchResponse } from '@algolia/client-search';
import type { SearchIndex } from 'algoliasearch';

import {
  deletePreviousObjects,
  getAllHits,
  getBellCurveMetrics,
  getStandardDeviation,
} from '../process-performance';

describe('getStandardDeviation', () => {
  it('should return 0 for an empty array', () => {
    expect(getStandardDeviation([], 0)).toBe(0);
  });

  it('should return correct standard deviation for an array of numbers', () => {
    const numbers = [
      20, 1, 3, 2, 5, 19, 14, 9, 18, 16, 11, 8, 12, 10, 4, 7, 13, 6, 15, 17,
    ];
    const mean =
      numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
    const stdDev = getStandardDeviation(numbers, mean);
    expect(mean).toEqual(10.5);
    expect(stdDev).toBeCloseTo(5.766, 3);
  });
});

describe('getBellCurveMetrics', () => {
  it('returns correct performance metrics when the data has a variety of integers', () => {
    const data = [
      20, 1, 3, 2, 5, 19, 14, 9, 18, 16, 11, 8, 12, 10, 4, 7, 13, 6, 15, 17,
    ];
    const metrics = getBellCurveMetrics(data);
    expect(metrics).toEqual({
      belowAverageMin: 1,
      belowAverageMax: 4,
      averageMin: 5,
      averageMax: 16,
      aboveAverageMin: 17,
      aboveAverageMax: 20,
    });
  });

  it('returns correct performance metrics when the data has a lot of zeros', () => {
    const data = [0, 1, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 1, 0, 0, 1, 2];
    const metrics = getBellCurveMetrics(data);
    expect(metrics).toEqual({
      belowAverageMin: 0,
      belowAverageMax: -1,
      averageMin: -0,
      averageMax: 1,
      aboveAverageMin: 2,
      aboveAverageMax: 2,
    });
  });

  it('returns correct performance metrics when the data and result have decimal places', () => {
    const data = [0.58, 0.46, 0.71, 0.32, 0.98, 0.01, 0.33, 0.88, 0.61, 0.41];
    const metrics = getBellCurveMetrics(data, false);
    expect(metrics).toEqual({
      belowAverageMin: 0.01,
      belowAverageMax: 0.25,
      averageMin: 0.26,
      averageMax: 0.8,
      aboveAverageMin: 0.81,
      aboveAverageMax: 0.98,
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
