import {
  documentCategories,
  outputTypes,
  teamOutputDocumentTypes,
  timeRanges,
} from '@asap-hub/model';
import type { SearchIndex } from 'algoliasearch';

import {
  processTeamProductivityPerformance,
  processUserProductivityPerformance,
} from '../productivity';

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
      documentCategories.forEach((category) => {
        expect(mockIndex.search).toHaveBeenCalledWith('', {
          filters: `__meta.range:"${range}" AND __meta.documentCategory:"${category}" AND __meta.type:"user-productivity"`,
          attributesToRetrieve: ['asapOutput', 'asapPublicOutput', 'ratio'],
          page: expect.any(Number),
          hitsPerPage: 50,
        });
      });
    });

    const userProductivityPerformance = {
      asapOutput: {
        aboveAverageMax: -1,
        aboveAverageMin: -1,
        averageMax: 2,
        averageMin: 2,
        belowAverageMax: 1,
        belowAverageMin: 1,
      },
      asapPublicOutput: {
        aboveAverageMax: -1,
        aboveAverageMin: -1,
        averageMax: 2,
        averageMin: 1,
        belowAverageMax: 0,
        belowAverageMin: 0,
      },
      ratio: {
        aboveAverageMax: -1,
        aboveAverageMin: -1,
        averageMax: 1,
        averageMin: 0.01,
        belowAverageMax: 0,
        belowAverageMin: 0,
      },
    };

    // one for each time range and document category combination
    expect(await mockIndex.saveObject).toHaveBeenCalledTimes(30);
    expect(await mockIndex.saveObject).toHaveBeenCalledWith(
      {
        __meta: {
          range: 'all',
          type: 'user-productivity-performance',
          documentCategory: 'protocol',
        },
        ...userProductivityPerformance,
      },
      { autoGenerateObjectIDIfNotExist: true },
    );
    expect(await mockIndex.saveObject).toHaveBeenCalledWith(
      {
        __meta: {
          range: 'all',
          type: 'user-productivity-performance',
          documentCategory: 'article',
        },
        ...userProductivityPerformance,
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
              'Lab Material': 4,
              Protocol: 0,
            },
            {
              Article: 20,
              Bioinformatics: 10,
              Dataset: 30,
              'Lab Material': 13,
              Protocol: 10,
            },
            {
              Article: 5,
              Bioinformatics: 7,
              Dataset: 8,
              'Lab Material': 20,
              Protocol: 13,
            },
            {
              Article: 0,
              Bioinformatics: 4,
              Dataset: 5,
              'Lab Material': 7,
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
      outputTypes.forEach((outputType) => {
        expect(mockIndex.search).toHaveBeenCalledWith('', {
          filters: `__meta.range:"${range}" AND __meta.outputType:"${outputType}" AND __meta.type:"team-productivity"`,
          attributesToRetrieve: teamOutputDocumentTypes,
          page: expect.any(Number),
          hitsPerPage: 50,
        });
      });
    });

    const teamProductivityPerformance = {
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
        aboveAverageMin: 20,
        averageMax: 19,
        averageMin: 4,
        belowAverageMax: 3,
        belowAverageMin: 2,
      },
      labMaterial: {
        aboveAverageMax: 20,
        aboveAverageMin: 17,
        averageMax: 16,
        averageMin: 6,
        belowAverageMax: 5,
        belowAverageMin: 4,
      },
      protocol: {
        aboveAverageMax: 13,
        aboveAverageMin: 12,
        averageMax: 11,
        averageMin: 5,
        belowAverageMax: 4,
        belowAverageMin: 0,
      },
    };
    // one for each time range
    expect(await mockIndex.saveObject).toHaveBeenCalledTimes(10);
    expect(await mockIndex.saveObject).toHaveBeenCalledWith(
      {
        __meta: {
          range: 'all',
          type: 'team-productivity-performance',
          outputType: 'all',
        },
        ...teamProductivityPerformance,
      },
      { autoGenerateObjectIDIfNotExist: true },
    );
    expect(await mockIndex.saveObject).toHaveBeenCalledWith(
      {
        __meta: {
          range: 'all',
          type: 'team-productivity-performance',
          outputType: 'public',
        },
        ...teamProductivityPerformance,
      },
      { autoGenerateObjectIDIfNotExist: true },
    );
  });
});
