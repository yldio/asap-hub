import { timeRanges } from '@asap-hub/model';
import { SearchIndex } from 'algoliasearch';
import { processTeamCollaborationPerformance } from '../collaboration';

describe('processTeamCollaborationPerformance ', () => {
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
                  'Lab Resource': 4,
                  Protocol: 0,
                },
              },
              outputsCoProducedWithin: {
                Article: 19,
                Bioinformatics: 1,
                Dataset: 4,
                'Lab Resource': 4,
                Protocol: 0,
              },
            },
            {
              outputsCoProducedAcross: {
                byDocumentType: {
                  Article: 20,
                  Bioinformatics: 10,
                  Dataset: 30,
                  'Lab Resource': 13,
                  Protocol: 10,
                },
              },
              outputsCoProducedWithin: {
                Article: 20,
                Bioinformatics: 10,
                Dataset: 30,
                'Lab Resource': 13,
                Protocol: 10,
              },
            },
            {
              outputsCoProducedAcross: {
                byDocumentType: {
                  Article: 50,
                  Bioinformatics: 7,
                  Dataset: 5,
                  'Lab Resource': 20,
                  Protocol: 13,
                },
              },
              outputsCoProducedWithin: {
                Article: 5,
                Bioinformatics: 7,
                Dataset: 12,
                'Lab Resource': 20,
                Protocol: 14,
              },
            },
            {
              outputsCoProducedAcross: {
                byDocumentType: {
                  Article: 0,
                  Bioinformatics: 4,
                  Dataset: 8,
                  'Lab Resource': 7,
                  Protocol: 19,
                },
              },
              outputsCoProducedWithin: {
                Article: 0,
                Bioinformatics: 4,
                Dataset: 5,
                'Lab Resource': 7,
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
      expect(mockIndex.search).toHaveBeenCalledWith('', {
        filters: `__meta.range:"${range}" AND (__meta.type:"team-collaboration")`,
        attributesToRetrieve: [
          'outputsCoProducedAcross',
          'outputsCoProducedWithin',
        ],
        page: expect.any(Number),
        hitsPerPage: 50,
      });
    });

    // one for each time range
    expect(await mockIndex.saveObject).toHaveBeenCalledTimes(5);
    expect(await mockIndex.saveObject).toHaveBeenLastCalledWith(
      {
        __meta: { range: 'all', type: 'team-collaboration-performance' },
        accrossTeam: {
          article: {
            aboveAverageMax: 50,
            aboveAverageMin: 43,
            averageMax: 42,
            averageMin: 7,
            belowAverageMax: 6,
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
            belowAverageMin: 3,
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
            aboveAverageMax: 19,
            aboveAverageMin: 18,
            averageMax: 17,
            averageMin: 4,
            belowAverageMax: 3,
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
            aboveAverageMin: 24,
            averageMax: 23,
            averageMin: 3,
            belowAverageMax: 2,
            belowAverageMin: 4,
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
            aboveAverageMax: 14,
            aboveAverageMin: 14,
            averageMax: 13,
            averageMin: 4,
            belowAverageMax: 3,
            belowAverageMin: 0,
          },
        },
      },
      { autoGenerateObjectIDIfNotExist: true },
    );
  });
});
