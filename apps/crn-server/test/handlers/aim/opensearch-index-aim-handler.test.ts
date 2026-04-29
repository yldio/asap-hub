import { indexAimOpensearchHandler } from '../../../src/handlers/aim/opensearch-index-aim-handler';
import { createEventBridgeEventMock } from '../../helpers/events';

jest.mock('../../../src/utils/logger');

const mockDeleteAimById = jest.fn().mockResolvedValue(undefined);
const mockReindexByProjectId = jest.fn().mockResolvedValue(undefined);
const mockDeleteByProjectId = jest.fn().mockResolvedValue(undefined);

jest.mock('../../../src/handlers/opensearch/aims-milestones-reindex', () => ({
  deleteAimById: (...args: unknown[]) => mockDeleteAimById(...args),
  reindexByProjectId: (...args: unknown[]) => mockReindexByProjectId(...args),
  deleteByProjectId: (...args: unknown[]) => mockDeleteByProjectId(...args),
}));

const mockProvider = {
  fetchProjectsWithAims: jest.fn(),
  fetchProjectsWithAimsDetail: jest.fn(),
  fetchAimsWithMilestones: jest.fn(),
  fetchMilestones: jest.fn(),
  fetchArticlesForAim: jest.fn(),
  fetchArticlesForMilestone: jest.fn(),
  fetchAimIdsLinkedToMilestone: jest.fn(),
  fetchProjectWithAimsDetailByAimId: jest.fn(),
  fetchAimWithMilestonesById: jest.fn(),
  fetchMilestoneById: jest.fn(),
  fetchProjectWithAimsDetailById: jest.fn(),
  fetchProjectIdBySupplementGrantId: jest.fn(),
  updateArticlesForMilestone: jest.fn(),
};

describe('OpenSearch Index Aim Handler', () => {
  const handler = indexAimOpensearchHandler(mockProvider);

  afterEach(() => jest.clearAllMocks());

  describe('Aim events', () => {
    test('AimsPublished resolves the parent project and reindexes it', async () => {
      mockProvider.fetchProjectWithAimsDetailByAimId.mockResolvedValue({
        sys: { id: 'project-1' },
      });

      const event = createEventBridgeEventMock(
        { resourceId: 'aim-1' },
        'AimsPublished',
        'aim-1',
      );

      await handler(event);

      expect(
        mockProvider.fetchProjectWithAimsDetailByAimId,
      ).toHaveBeenCalledWith('aim-1');
      expect(mockReindexByProjectId).toHaveBeenCalledWith(
        mockProvider,
        'project-1',
      );
      expect(mockDeleteAimById).not.toHaveBeenCalled();
    });

    test('AimsPublished skips when parent project not found', async () => {
      mockProvider.fetchProjectWithAimsDetailByAimId.mockResolvedValue(null);

      const event = createEventBridgeEventMock(
        { resourceId: 'aim-1' },
        'AimsPublished',
        'aim-1',
      );

      await handler(event);

      expect(mockReindexByProjectId).not.toHaveBeenCalled();
    });

    test('AimsUnpublished deletes the aim; milestone cleanup is deferred to the full reindex', async () => {
      const event = createEventBridgeEventMock(
        { resourceId: 'aim-1' },
        'AimsUnpublished',
        'aim-1',
      );

      await handler(event);

      expect(mockDeleteAimById).toHaveBeenCalledWith('aim-1');
    });
  });

  describe('Project events', () => {
    test('ProjectsPublished reindexes all aims and milestones for the project', async () => {
      const event = createEventBridgeEventMock(
        { resourceId: 'project-1' },
        'ProjectsPublished',
        'project-1',
      );

      await handler(event);

      expect(mockReindexByProjectId).toHaveBeenCalledWith(
        mockProvider,
        'project-1',
      );
      expect(mockDeleteByProjectId).not.toHaveBeenCalled();
    });

    test('ProjectsUnpublished deletes all aims and milestones for the project', async () => {
      const event = createEventBridgeEventMock(
        { resourceId: 'project-1' },
        'ProjectsUnpublished',
        'project-1',
      );

      await handler(event);

      expect(mockDeleteByProjectId).toHaveBeenCalledWith('project-1');
      expect(mockReindexByProjectId).not.toHaveBeenCalled();
    });
  });

  describe('SupplementGrant events', () => {
    test('SupplementGrantPublished finds the project and reindexes its aims and milestones', async () => {
      mockProvider.fetchProjectIdBySupplementGrantId.mockResolvedValue(
        'project-1',
      );

      const event = createEventBridgeEventMock(
        { resourceId: 'sg-1' },
        'SupplementGrantPublished',
        'sg-1',
      );

      await handler(event);

      expect(
        mockProvider.fetchProjectIdBySupplementGrantId,
      ).toHaveBeenCalledWith('sg-1');
      expect(mockReindexByProjectId).toHaveBeenCalledWith(
        mockProvider,
        'project-1',
      );
    });

    test('SupplementGrantUnpublished finds the project and reindexes its aims and milestones', async () => {
      mockProvider.fetchProjectIdBySupplementGrantId.mockResolvedValue(
        'project-1',
      );

      const event = createEventBridgeEventMock(
        { resourceId: 'sg-1' },
        'SupplementGrantUnpublished',
        'sg-1',
      );

      await handler(event);

      expect(
        mockProvider.fetchProjectIdBySupplementGrantId,
      ).toHaveBeenCalledWith('sg-1');
      expect(mockReindexByProjectId).toHaveBeenCalledWith(
        mockProvider,
        'project-1',
      );
    });

    test('SupplementGrantPublished does nothing when project not found', async () => {
      mockProvider.fetchProjectIdBySupplementGrantId.mockResolvedValue(null);

      const event = createEventBridgeEventMock(
        { resourceId: 'sg-1' },
        'SupplementGrantPublished',
        'sg-1',
      );

      await handler(event);

      expect(mockReindexByProjectId).not.toHaveBeenCalled();
    });
  });
});
