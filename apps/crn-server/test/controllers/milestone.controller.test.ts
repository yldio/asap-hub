import { NotFoundError } from '@asap-hub/errors';
import MilestoneController from '../../src/controllers/milestone.controller';
import { aimsMilestonesDataProviderMock } from '../mocks/aims-milestones.data-provider.mock';

describe('Milestone Controller', () => {
  const controller = new MilestoneController(aimsMilestonesDataProviderMock);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchById', () => {
    it('returns projectId from the first linked aim', async () => {
      aimsMilestonesDataProviderMock.fetchAimIdsLinkedToMilestone.mockResolvedValueOnce(
        ['aim-1', 'aim-2'],
      );
      aimsMilestonesDataProviderMock.fetchProjectWithAimsDetailByAimId.mockResolvedValueOnce(
        { sys: { id: 'project-1' } } as never,
      );

      const result = await controller.fetchById('milestone-1');

      expect(result).toEqual({ projectId: 'project-1' });
      expect(
        aimsMilestonesDataProviderMock.fetchAimIdsLinkedToMilestone,
      ).toHaveBeenCalledWith('milestone-1');
      expect(
        aimsMilestonesDataProviderMock.fetchProjectWithAimsDetailByAimId,
      ).toHaveBeenCalledWith('aim-1');
    });

    it('tries the next aim if the first returns null', async () => {
      aimsMilestonesDataProviderMock.fetchAimIdsLinkedToMilestone.mockResolvedValueOnce(
        ['aim-1', 'aim-2'],
      );
      aimsMilestonesDataProviderMock.fetchProjectWithAimsDetailByAimId
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ sys: { id: 'project-2' } } as never);

      const result = await controller.fetchById('milestone-1');

      expect(result).toEqual({ projectId: 'project-2' });
    });

    it('throws NotFoundError when no aims are linked', async () => {
      aimsMilestonesDataProviderMock.fetchAimIdsLinkedToMilestone.mockResolvedValueOnce(
        [],
      );

      await expect(controller.fetchById('milestone-orphan')).rejects.toThrow(
        NotFoundError,
      );
    });

    it('throws NotFoundError when all linked aims have no project', async () => {
      aimsMilestonesDataProviderMock.fetchAimIdsLinkedToMilestone.mockResolvedValueOnce(
        ['aim-1'],
      );
      aimsMilestonesDataProviderMock.fetchProjectWithAimsDetailByAimId.mockResolvedValueOnce(
        null,
      );

      await expect(controller.fetchById('milestone-1')).rejects.toThrow(
        NotFoundError,
      );
    });
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
