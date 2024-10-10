import { documentCategories, outputTypes, timeRanges } from '@asap-hub/model';
import { SearchIndex } from 'algoliasearch';
import {
  processTeamCollaborationPerformance,
  processUserCollaborationPerformance,
} from '../collaboration';

describe('processUserCollaborationPerformance', () => {
  it('should process user collaboration performance', async () => {
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
              teams: [
                {
                  outputsCoAuthoredAcrossTeams: 1,
                  outputsCoAuthoredWithinTeam: 2,
                },
                {
                  outputsCoAuthoredAcrossTeams: 4,
                  outputsCoAuthoredWithinTeam: 6,
                },
              ],
            },
            {
              teams: [
                {
                  outputsCoAuthoredAcrossTeams: 3,
                  outputsCoAuthoredWithinTeam: 14,
                },
              ],
            },
            {
              teams: [
                {
                  outputsCoAuthoredAcrossTeams: 2,
                  outputsCoAuthoredWithinTeam: 0,
                },
              ],
            },
          ],
        }),
      deleteObjects: jest.fn(),
      saveObject: jest.fn().mockResolvedValue({}),
    } as unknown as SearchIndex;

    await processUserCollaborationPerformance(mockIndex);

    expect(mockIndex.deleteObjects).toHaveBeenCalledWith([
      'old-performance-1',
      'old-performance-2',
      'old-performance-3',
    ]);

    timeRanges.forEach((range) => {
      documentCategories.forEach((documentCategory) => {
        expect(mockIndex.search).toHaveBeenCalledWith('', {
          filters: `__meta.range:"${range}" AND __meta.documentCategory:"${documentCategory}" AND __meta.type:"user-collaboration"`,
          attributesToRetrieve: ['teams'],
          page: expect.any(Number),
          hitsPerPage: 50,
        });
      });
    });

    // one for each time range and document category combination
    expect(await mockIndex.saveObject).toHaveBeenCalledTimes(30);
    expect(await mockIndex.saveObject).toHaveBeenLastCalledWith(
      {
        __meta: {
          range: 'all',
          type: 'user-collaboration-performance',
          documentCategory: 'protocol',
        },
        acrossTeam: {
          aboveAverageMax: 4,
          aboveAverageMin: 4,
          averageMax: 3,
          averageMin: 2,
          belowAverageMax: 1,
          belowAverageMin: 1,
        },
        withinTeam: {
          aboveAverageMax: 14,
          aboveAverageMin: 11,
          averageMax: 10,
          averageMin: 1,
          belowAverageMax: 0,
          belowAverageMin: 0,
        },
      },
      { autoGenerateObjectIDIfNotExist: true },
    );
  });
});

describe('processTeamCollaborationPerformance', () => {
  it('should process team collaboration performance', async () => {
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
              outputsCoProducedAcross: {
                byDocumentType: {
                  Article: 29,
                  Bioinformatics: 1,
                  Dataset: 3,
                  'Lab Material': 4,
                  Protocol: 0,
                },
              },
              outputsCoProducedWithin: {
                Article: 19,
                Bioinformatics: 1,
                Dataset: 4,
                'Lab Material': 4,
                Protocol: 0,
              },
            },
            {
              outputsCoProducedAcross: {
                byDocumentType: {
                  Article: 20,
                  Bioinformatics: 10,
                  Dataset: 30,
                  'Lab Material': 13,
                  Protocol: 10,
                },
              },
              outputsCoProducedWithin: {
                Article: 20,
                Bioinformatics: 10,
                Dataset: 30,
                'Lab Material': 13,
                Protocol: 10,
              },
            },
            {
              outputsCoProducedAcross: {
                byDocumentType: {
                  Article: 50,
                  Bioinformatics: 7,
                  Dataset: 5,
                  'Lab Material': 20,
                  Protocol: 13,
                },
              },
              outputsCoProducedWithin: {
                Article: 5,
                Bioinformatics: 7,
                Dataset: 12,
                'Lab Material': 20,
                Protocol: 14,
              },
            },
            {
              outputsCoProducedAcross: {
                byDocumentType: {
                  Article: 0,
                  Bioinformatics: 4,
                  Dataset: 8,
                  'Lab Material': 7,
                  Protocol: 19,
                },
              },
              outputsCoProducedWithin: {
                Article: 0,
                Bioinformatics: 4,
                Dataset: 5,
                'Lab Material': 7,
                Protocol: 9,
              },
            },
          ],
          nbPages: 1,
        }),
      deleteObjects: jest.fn(),
      saveObject: jest.fn().mockResolvedValue({}),
    } as unknown as SearchIndex;

    await processTeamCollaborationPerformance(mockIndex);

    expect(mockIndex.deleteObjects).toHaveBeenCalledWith([
      'old-performance-1',
      'old-performance-2',
      'old-performance-3',
    ]);

    timeRanges.forEach((range) => {
      outputTypes.forEach((outputType) => {
        expect(mockIndex.search).toHaveBeenCalledWith('', {
          filters: `__meta.range:"${range}" AND __meta.outputType:"${outputType}" AND __meta.type:"team-collaboration"`,
          attributesToRetrieve: [
            'outputsCoProducedAcross',
            'outputsCoProducedWithin',
          ],
          page: expect.any(Number),
          hitsPerPage: 50,
        });
      });
    });

    const teamCollaborationPerformance = {
      acrossTeam: {
        article: {
          aboveAverageMax: 50,
          aboveAverageMin: 40,
          averageMax: 39,
          averageMin: 10,
          belowAverageMax: 9,
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
          belowAverageMin: 3,
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
          aboveAverageMax: 19,
          aboveAverageMin: 17,
          averageMax: 16,
          averageMin: 5,
          belowAverageMax: 4,
          belowAverageMin: 0,
        },
      },
      withinTeam: {
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
          aboveAverageMin: 22,
          averageMax: 21,
          averageMin: 5,
          belowAverageMax: 4,
          belowAverageMin: 4,
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
          aboveAverageMax: 14,
          aboveAverageMin: 13,
          averageMax: 12,
          averageMin: 5,
          belowAverageMax: 4,
          belowAverageMin: 0,
        },
      },
    };

    // one for each time range and output type combination
    expect(await mockIndex.saveObject).toHaveBeenCalledTimes(10);
    expect(await mockIndex.saveObject).toHaveBeenCalledWith(
      {
        __meta: {
          range: 'all',
          type: 'team-collaboration-performance',
          outputType: 'public',
        },
        ...teamCollaborationPerformance,
      },
      { autoGenerateObjectIDIfNotExist: true },
    );
    expect(await mockIndex.saveObject).toHaveBeenCalledWith(
      {
        __meta: {
          range: 'all',
          type: 'team-collaboration-performance',
          outputType: 'all',
        },
        ...teamCollaborationPerformance,
      },
      { autoGenerateObjectIDIfNotExist: true },
    );
  });
});
