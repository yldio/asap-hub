import { timeRanges } from '@asap-hub/model';
import { SearchIndex } from 'algoliasearch';
import { processEngagementPerformance } from '../engagement';

describe('processEngagementPerformance', () => {
  it('should process engagement performance', async () => {
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
              eventCount: 25,
              totalSpeakerCount: 13,
              uniqueAllRolesCount: 12,
              uniqueKeyPersonnelCount: 4,
            },
            {
              eventCount: 20,
              totalSpeakerCount: 15,
              uniqueAllRolesCount: 12,
              uniqueKeyPersonnelCount: 4,
            },
            {
              eventCount: 5,
              totalSpeakerCount: 3,
              uniqueAllRolesCount: 2,
              uniqueKeyPersonnelCount: 4,
            },
          ],
          nbPages: 1,
        }),
      deleteObjects: jest.fn(),
      saveObject: jest.fn().mockResolvedValue({}),
    } as unknown as SearchIndex;

    await processEngagementPerformance(mockIndex);

    expect(mockIndex.deleteObjects).toHaveBeenCalledWith([
      'old-performance-1',
      'old-performance-2',
      'old-performance-3',
    ]);

    timeRanges.forEach((range) => {
      expect(mockIndex.search).toHaveBeenCalledWith('', {
        filters: `__meta.range:"${range}" AND __meta.type:"engagement"`,
        attributesToRetrieve: [
          'eventCount',
          'totalSpeakerCount',
          'uniqueAllRolesCount',
          'uniqueKeyPersonnelCount',
        ],
        page: expect.any(Number),
        hitsPerPage: 50,
      });
    });

    // one for each time range
    expect(await mockIndex.saveObject).toHaveBeenCalledTimes(5);
    expect(mockIndex.saveObject).toHaveBeenCalledWith(
      {
        __meta: {
          type: 'engagement-performance',
          range: 'all',
        },
        events: {
          aboveAverageMax: -1,
          aboveAverageMin: -1,
          averageMax: 0,
          averageMin: 0,
          belowAverageMax: -1,
          belowAverageMin: -1,
        },
        totalSpeakers: {
          aboveAverageMax: -1,
          aboveAverageMin: -1,
          averageMax: 0,
          averageMin: 0,
          belowAverageMax: -1,
          belowAverageMin: -1,
        },
        uniqueAllRoles: {
          aboveAverageMax: -1,
          aboveAverageMin: -1,
          averageMax: 0,
          averageMin: 0,
          belowAverageMax: -1,
          belowAverageMin: -1,
        },
        uniqueKeyPersonnel: {
          aboveAverageMax: -1,
          aboveAverageMin: -1,
          averageMax: 0,
          averageMin: 0,
          belowAverageMax: -1,
          belowAverageMin: -1,
        },
      },
      { autoGenerateObjectIDIfNotExist: true },
    );
  });
});
