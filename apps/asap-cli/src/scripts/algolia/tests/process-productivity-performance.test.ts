import { SearchResponse } from '@algolia/client-search';
import { teamOutputDocumentTypes, timeRanges } from '@asap-hub/model';
import type { SearchIndex } from 'algoliasearch';

import {
  deletePreviousObjects,
  getAllHits,
  getBellCurveMetrics,
  getStandardDeviation,
  processTeamProductivityPerformance,
  processUserProductivityPerformance,
} from '../process-productivity-performance';

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
    const data = [
      0.5839192429634555, 0.4588917547846599, 0.7144998231708924,
      0.31761467673226364, 0.9835153157023447, 0.012174713013646232,
      0.3345662942521736, 0.8791390732735015, 0.6145511688987974,
      0.4143108942089136,
    ];
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

describe('processUserProductivityPerformance', () => {
  it('should process user productivity performance', async () => {
    const mockIndex = {
      search: jest
        .fn()
        .mockResolvedValueOnce({
          hits: [
            { objectID: 'old-performance-1' },
            { objectID: 'old-performance-2' },
            { objectID: 'old-performance-3' },
          ],
        })
        .mockResolvedValue({
          hits: [
            {
              asapOutput: 1,
              asapPublicOutput: 0,
              ratio: 0,
            },
            {
              asapOutput: 2,
              asapPublicOutput: 0,
              ratio: 0,
            },
            {
              asapOutput: 2,
              asapPublicOutput: 2,
              ratio: 1,
            },
          ],
          nbPages: 1,
        }),
      deleteObjects: jest.fn().mockResolvedValue({}),
      saveObject: jest.fn().mockResolvedValue({}),
    } as unknown as SearchIndex;

    await processUserProductivityPerformance(mockIndex);

    expect(mockIndex.deleteObjects).toHaveBeenCalledWith([
      'old-performance-1',
      'old-performance-2',
      'old-performance-3',
    ]);

    timeRanges.forEach((range) => {
      expect(mockIndex.search).toHaveBeenCalledWith('', {
        filters: `__meta.range:"${range}" AND (__meta.type:"user-productivity")`,
        attributesToRetrieve: ['asapOutput', 'asapPublicOutput', 'ratio'],
        page: expect.any(Number),
        hitsPerPage: 50,
      });
    });

    // one for each time range
    expect(await mockIndex.saveObject).toHaveBeenCalledTimes(5);
    expect(await mockIndex.saveObject).toHaveBeenLastCalledWith(
      {
        __meta: { range: 'all', type: 'user-productivity-performance' },
        asapOutput: {
          aboveAverageMax: 2,
          aboveAverageMin: 3,
          averageMax: 2,
          averageMin: 2,
          belowAverageMax: 1,
          belowAverageMin: 1,
        },
        asapPublicOutput: {
          aboveAverageMax: 2,
          aboveAverageMin: 2,
          averageMax: 1,
          averageMin: -0,
          belowAverageMax: -1,
          belowAverageMin: 0,
        },
        ratio: {
          aboveAverageMax: 1,
          aboveAverageMin: 0.81,
          averageMax: 0.8,
          averageMin: -0.13,
          belowAverageMax: -0.14,
          belowAverageMin: 0,
        },
      },
      { autoGenerateObjectIDIfNotExist: true },
    );
  });
});

describe('processTeamProductivityPerformance', () => {
  it('should process team productivity performance', async () => {
    const mockIndex = {
      search: jest
        .fn()
        .mockResolvedValueOnce({
          hits: [
            { objectID: 'old-performance-1' },
            { objectID: 'old-performance-2' },
            { objectID: 'old-performance-3' },
          ],
        })
        .mockResolvedValue({
          hits: [
            {
              Article: 19,
              Bioinformatics: 1,
              Dataset: 2,
              'Lab Resource': 4,
              Protocol: 0,
            },
            {
              Article: 20,
              Bioinformatics: 10,
              Dataset: 30,
              'Lab Resource': 13,
              Protocol: 10,
            },
            {
              Article: 5,
              Bioinformatics: 7,
              Dataset: 8,
              'Lab Resource': 20,
              Protocol: 13,
            },
            {
              Article: 0,
              Bioinformatics: 4,
              Dataset: 5,
              'Lab Resource': 7,
              Protocol: 9,
            },
          ],
          nbPages: 1,
        }),
      deleteObjects: jest.fn(),
      saveObject: jest.fn().mockResolvedValue({}),
    } as unknown as SearchIndex;

    await processTeamProductivityPerformance(mockIndex);

    expect(mockIndex.deleteObjects).toHaveBeenCalledWith([
      'old-performance-1',
      'old-performance-2',
      'old-performance-3',
    ]);

    timeRanges.forEach((range) => {
      expect(mockIndex.search).toHaveBeenCalledWith('', {
        filters: `__meta.range:"${range}" AND (__meta.type:"team-productivity")`,
        attributesToRetrieve: teamOutputDocumentTypes,
        page: expect.any(Number),
        hitsPerPage: 50,
      });
    });

    // one for each time range
    expect(await mockIndex.saveObject).toHaveBeenCalledTimes(5);
    expect(await mockIndex.saveObject).toHaveBeenLastCalledWith(
      {
        __meta: { range: 'all', type: 'team-productivity-performance' },
        article: {
          aboveAverageMax: 20,
          aboveAverageMin: 20,
          averageMax: 19,
          averageMin: 3,
          belowAverageMax: 2,
          belowAverageMin: 0,
        },
        bioinformatics: {
          aboveAverageMax: 10,
          aboveAverageMin: 9,
          averageMax: 8,
          averageMin: 3,
          belowAverageMax: 2,
          belowAverageMin: 1,
        },
        dataset: {
          aboveAverageMax: 30,
          aboveAverageMin: 23,
          averageMax: 22,
          averageMin: 1,
          belowAverageMax: 0,
          belowAverageMin: 2,
        },
        labResource: {
          aboveAverageMax: 20,
          aboveAverageMin: 18,
          averageMax: 17,
          averageMin: 5,
          belowAverageMax: 4,
          belowAverageMin: 4,
        },
        protocol: {
          aboveAverageMax: 13,
          aboveAverageMin: 13,
          averageMax: 12,
          averageMin: 4,
          belowAverageMax: 3,
          belowAverageMin: 0,
        },
      },
      { autoGenerateObjectIDIfNotExist: true },
    );
  });
});
