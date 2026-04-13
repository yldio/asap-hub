import { indexAimOpensearchHandler } from '../../../src/handlers/aim/opensearch-index-aim-handler';
import { createEventBridgeEventMock } from '../../helpers/events';

jest.mock('../../../src/utils/logger');

const mockReindexAimById = jest.fn().mockResolvedValue(undefined);
const mockDeleteAimById = jest.fn().mockResolvedValue(undefined);
const mockDeleteMilestonesByAimId = jest.fn().mockResolvedValue(undefined);
const mockReindexByProjectId = jest.fn().mockResolvedValue(undefined);
const mockDeleteByProjectId = jest.fn().mockResolvedValue(undefined);

jest.mock('../../../src/handlers/opensearch/aims-milestones-reindex', () => ({
  reindexAimById: (...args: unknown[]) => mockReindexAimById(...args),
  deleteAimById: (...args: unknown[]) => mockDeleteAimById(...args),
  deleteMilestonesByAimId: (...args: unknown[]) =>
    mockDeleteMilestonesByAimId(...args),
  reindexByProjectId: (...args: unknown[]) => mockReindexByProjectId(...args),
  deleteByProjectId: (...args: unknown[]) => mockDeleteByProjectId(...args),
}));

const mockProvider = {
  fetchProjectsWithAims: jest.fn(),
  fetchProjectsWithAimsDetail: jest.fn(),
  fetchAimsWithMilestones: jest.fn(),
  fetchMilestones: jest.fn(),
  fetchArticlesForAim: jest.fn(),
  fetchAimIdsLinkedToMilestone: jest.fn(),
  fetchProjectWithAimsDetailByAimId: jest.fn(),
  fetchAimWithMilestonesById: jest.fn(),
  fetchMilestoneById: jest.fn(),
  fetchProjectWithAimsDetailById: jest.fn(),
  fetchProjectIdByMembershipId: jest.fn(),
  fetchProjectIdBySupplementGrantId: jest.fn(),
};

describe('OpenSearch Index Aim Handler', () => {
  const handler = indexAimOpensearchHandler(mockProvider);

  afterEach(() => jest.clearAllMocks());

  describe('Aim events', () => {
    test('AimsPublished reindexes the aim (which includes milestone delete+reinsert)', async () => {
      const event = createEventBridgeEventMock(
        { resourceId: 'aim-1' },
        'AimsPublished',
        'aim-1',
      );

      await handler(event);

      expect(mockReindexAimById).toHaveBeenCalledWith(mockProvider, 'aim-1');
      expect(mockDeleteAimById).not.toHaveBeenCalled();
    });

    test('AimsUnpublished deletes the aim and its milestones', async () => {
      const event = createEventBridgeEventMock(
        { resourceId: 'aim-1' },
        'AimsUnpublished',
        'aim-1',
      );

      await handler(event);

      expect(mockDeleteAimById).toHaveBeenCalledWith('aim-1');
      expect(mockDeleteMilestonesByAimId).toHaveBeenCalledWith(
        mockProvider,
        'aim-1',
      );
      expect(mockReindexAimById).not.toHaveBeenCalled();
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

      expect(mockDeleteByProjectId).toHaveBeenCalledWith(
        mockProvider,
        'project-1',
      );
      expect(mockReindexByProjectId).not.toHaveBeenCalled();
    });
  });

  describe('ProjectMembership events', () => {
    test('ProjectMembershipPublished finds the project and reindexes its aims', async () => {
      mockProvider.fetchProjectIdByMembershipId.mockResolvedValue('project-1');

      const event = createEventBridgeEventMock(
        { resourceId: 'membership-1' },
        'ProjectMembershipPublished',
        'membership-1',
      );

      await handler(event);

      expect(mockProvider.fetchProjectIdByMembershipId).toHaveBeenCalledWith(
        'membership-1',
      );
      expect(mockReindexByProjectId).toHaveBeenCalledWith(
        mockProvider,
        'project-1',
      );
    });

    test('ProjectMembershipUnpublished finds the project and reindexes its aims', async () => {
      mockProvider.fetchProjectIdByMembershipId.mockResolvedValue('project-1');

      const event = createEventBridgeEventMock(
        { resourceId: 'membership-1' },
        'ProjectMembershipUnpublished',
        'membership-1',
      );

      await handler(event);

      expect(mockProvider.fetchProjectIdByMembershipId).toHaveBeenCalledWith(
        'membership-1',
      );
      expect(mockReindexByProjectId).toHaveBeenCalledWith(
        mockProvider,
        'project-1',
      );
    });

    test('ProjectMembershipPublished does nothing when project not found', async () => {
      mockProvider.fetchProjectIdByMembershipId.mockResolvedValue(null);

      const event = createEventBridgeEventMock(
        { resourceId: 'membership-1' },
        'ProjectMembershipPublished',
        'membership-1',
      );

      await handler(event);

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
