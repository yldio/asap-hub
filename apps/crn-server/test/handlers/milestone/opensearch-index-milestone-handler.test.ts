import { indexMilestoneOpensearchHandler } from '../../../src/handlers/milestone/opensearch-index-milestone-handler';
import { createEventBridgeEventMock } from '../../helpers/events';

jest.mock('../../../src/utils/logger');

const mockReindexMilestoneById = jest.fn().mockResolvedValue(undefined);
const mockReindexAimsByMilestoneId = jest.fn().mockResolvedValue(undefined);
const mockDeleteMilestoneById = jest.fn().mockResolvedValue(undefined);

jest.mock('../../../src/handlers/opensearch/aims-milestones-reindex', () => ({
  reindexMilestoneById: (...args: unknown[]) =>
    mockReindexMilestoneById(...args),
  reindexAimsByMilestoneId: (...args: unknown[]) =>
    mockReindexAimsByMilestoneId(...args),
  deleteMilestoneById: (...args: unknown[]) => mockDeleteMilestoneById(...args),
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

describe('OpenSearch Index Milestone Handler', () => {
  const handler = indexMilestoneOpensearchHandler(mockProvider);

  afterEach(() => jest.clearAllMocks());

  test('MilestonesPublished reindexes the milestone and linked aims', async () => {
    const event = createEventBridgeEventMock(
      { resourceId: 'milestone-1' },
      'MilestonesPublished',
      'milestone-1',
    );

    await handler(event);

    expect(mockReindexMilestoneById).toHaveBeenCalledWith(
      mockProvider,
      'milestone-1',
    );
    expect(mockReindexAimsByMilestoneId).toHaveBeenCalledWith(
      mockProvider,
      'milestone-1',
    );
    expect(mockDeleteMilestoneById).not.toHaveBeenCalled();
  });

  test('MilestonesUnpublished reindexes linked aims then deletes the milestone', async () => {
    const event = createEventBridgeEventMock(
      { resourceId: 'milestone-1' },
      'MilestonesUnpublished',
      'milestone-1',
    );

    await handler(event);

    expect(mockReindexAimsByMilestoneId).toHaveBeenCalledWith(
      mockProvider,
      'milestone-1',
    );
    expect(mockDeleteMilestoneById).toHaveBeenCalledWith('milestone-1');
    expect(mockReindexMilestoneById).not.toHaveBeenCalled();
  });

  test('should throw when reindex fails', async () => {
    const error = new Error('Reindex failed');
    mockReindexMilestoneById.mockRejectedValueOnce(error);

    const event = createEventBridgeEventMock(
      { resourceId: 'milestone-1' },
      'MilestonesPublished',
      'milestone-1',
    );

    await expect(handler(event)).rejects.toThrow('Reindex failed');
  });
});
