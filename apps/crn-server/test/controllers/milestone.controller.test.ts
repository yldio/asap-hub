import MilestoneController from '../../src/controllers/milestone.controller';
import { aimsMilestonesDataProviderMock } from '../mocks/aims-milestones.data-provider.mock';

describe('Milestone Controller', () => {
  const controller = new MilestoneController(aimsMilestonesDataProviderMock);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchArticles', () => {
    it('delegates to the data provider and returns articles', async () => {
      const mockArticles = [
        { id: 'ro-1', title: 'Article One', href: '/shared-research/ro-1' },
        { id: 'ro-2', title: 'Article Two', href: '/shared-research/ro-2' },
      ];
      aimsMilestonesDataProviderMock.fetchArticlesForMilestone.mockResolvedValueOnce(
        mockArticles,
      );

      const result = await controller.fetchArticles('milestone-123');

      expect(result).toEqual(mockArticles);
      expect(
        aimsMilestonesDataProviderMock.fetchArticlesForMilestone,
      ).toHaveBeenCalledWith('milestone-123');
    });

    it('returns empty array when data provider returns no articles', async () => {
      aimsMilestonesDataProviderMock.fetchArticlesForMilestone.mockResolvedValueOnce(
        [],
      );

      const result = await controller.fetchArticles('milestone-empty');

      expect(result).toEqual([]);
    });
  });

  describe('updateArticles', () => {
    it('delegates to the data provider with milestoneId and articleIds', async () => {
      aimsMilestonesDataProviderMock.updateArticlesForMilestone.mockResolvedValueOnce(
        undefined,
      );

      await controller.updateArticles('milestone-1', ['ro-1', 'ro-2']);

      expect(
        aimsMilestonesDataProviderMock.updateArticlesForMilestone,
      ).toHaveBeenCalledWith('milestone-1', ['ro-1', 'ro-2']);
    });
  });
});
