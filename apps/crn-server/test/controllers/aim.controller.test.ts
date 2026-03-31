import AimController from '../../src/controllers/aim.controller';
import { AimsMilestonesDataProvider } from '../../src/data-providers/types';

const aimsMilestonesDataProviderMock = {
  fetchProjectsWithAims: jest.fn(),
  fetchProjectsWithAimsDetail: jest.fn(),
  fetchAimsWithMilestones: jest.fn(),
  fetchMilestones: jest.fn(),
  fetchArticlesForAim: jest.fn(),
} as unknown as jest.Mocked<AimsMilestonesDataProvider>;

describe('Aim Controller', () => {
  const controller = new AimController(aimsMilestonesDataProviderMock);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchArticles', () => {
    it('delegates to the data provider and returns articles', async () => {
      const mockArticles = [
        { id: 'ro-1', title: 'Article One', href: '/shared-research/ro-1' },
        { id: 'ro-2', title: 'Article Two', href: '/shared-research/ro-2' },
      ];
      aimsMilestonesDataProviderMock.fetchArticlesForAim.mockResolvedValueOnce(
        mockArticles,
      );

      const result = await controller.fetchArticles('aim-123');

      expect(result).toEqual(mockArticles);
      expect(
        aimsMilestonesDataProviderMock.fetchArticlesForAim,
      ).toHaveBeenCalledWith('aim-123');
    });

    it('returns empty array when data provider returns no articles', async () => {
      aimsMilestonesDataProviderMock.fetchArticlesForAim.mockResolvedValueOnce(
        [],
      );

      const result = await controller.fetchArticles('aim-empty');

      expect(result).toEqual([]);
    });
  });
});
