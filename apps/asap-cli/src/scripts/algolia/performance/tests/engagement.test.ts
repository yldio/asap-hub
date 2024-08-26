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

    expect(mockIndex.search).toHaveBeenCalledWith('', {
      filters: `__meta.type:"engagement"`,
      attributesToRetrieve: [
        'eventCount',
        'totalSpeakerCount',
        'uniqueAllRolesCount',
        'uniqueKeyPersonnelCount',
      ],
      page: expect.any(Number),
      hitsPerPage: 50,
    });

    expect(mockIndex.saveObject).toHaveBeenCalledWith(
      {
        __meta: {
          type: 'engagement-performance',
        },
        events: {
          aboveAverageMax: 25,
          aboveAverageMin: 26,
          averageMax: 25,
          averageMin: 9,
          belowAverageMax: 8,
          belowAverageMin: 5,
        },
        totalSpeakers: {
          aboveAverageMax: 15,
          aboveAverageMin: 16,
          averageMax: 15,
          averageMin: 6,
          belowAverageMax: 5,
          belowAverageMin: 3,
        },
        uniqueAllRoles: {
          aboveAverageMax: 12,
          aboveAverageMin: 14,
          averageMax: 13,
          averageMin: 4,
          belowAverageMax: 3,
          belowAverageMin: 2,
        },
        uniqueKeyPersonnel: {
          aboveAverageMax: 4,
          aboveAverageMin: 4,
          averageMax: 4,
          averageMin: 4,
          belowAverageMax: 4,
          belowAverageMin: 4,
        },
      },
      { autoGenerateObjectIDIfNotExist: true },
    );
  });
});
