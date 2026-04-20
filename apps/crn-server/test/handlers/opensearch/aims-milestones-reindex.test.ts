/* eslint-disable @typescript-eslint/no-explicit-any */

const mockGetClient = jest.fn();
const mockUpsertOpensearchDocuments = jest.fn().mockResolvedValue(undefined);
const mockDeleteByDocumentIds = jest.fn().mockResolvedValue(undefined);
const mockDeleteByFieldValue = jest.fn().mockResolvedValue(undefined);

jest.mock('@asap-hub/server-common', () => ({
  getClient: (...args: unknown[]) => mockGetClient(...args),
  upsertOpensearchDocuments: (...args: unknown[]) =>
    mockUpsertOpensearchDocuments(...args),
  deleteByDocumentIds: (...args: unknown[]) => mockDeleteByDocumentIds(...args),
  deleteByFieldValue: (...args: unknown[]) => mockDeleteByFieldValue(...args),
  getCloudWatchLogger: () => ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }),
}));

jest.mock('../../../src/utils/logger');

jest.mock('../../../src/config', () => ({
  awsRegion: 'us-east-1',
  environment: 'test',
  opensearchUsername: 'test-user',
  opensearchPassword: 'test-pass',
  contentfulAccessToken: 'token',
  contentfulEnvId: 'env',
  contentfulSpaceId: 'space',
}));

import {
  reindexMilestoneById,
  reindexAimsByMilestoneId,
  reindexMilestonesByAimId,
  reindexByProjectId,
  deleteAimById,
  deleteMilestoneById,
  deleteByProjectId,
} from '../../../src/handlers/opensearch/aims-milestones-reindex';
import type { AimsMilestonesDataProvider } from '../../../src/data-providers/types';

const mockClient = {} as any;

const createMockProvider = (): jest.Mocked<AimsMilestonesDataProvider> => ({
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
});

const makeProject = (overrides: any = {}) => ({
  sys: { id: 'project-1' },
  title: 'Project Alpha',
  status: 'Active',
  membersCollection: {
    items: [
      {
        projectMember: {
          __typename: 'Teams',
          sys: { id: 'team-1' },
          displayName: 'Team Alpha',
        },
      },
    ],
  },
  originalGrantAimsCollection: {
    items: [
      {
        sys: {
          id: 'aim-1',
          firstPublishedAt: '2025-01-01T00:00:00.000Z',
          publishedAt: '2025-06-01T00:00:00.000Z',
        },
        description: 'First aim',
      },
    ],
  },
  supplementGrant: null,
  ...overrides,
});

const makeMilestone = (overrides: any = {}) => ({
  sys: {
    id: 'ms-1',
    firstPublishedAt: '2025-02-01T00:00:00.000Z',
    publishedAt: '2025-07-01T00:00:00.000Z',
  },
  description: 'First milestone',
  status: 'In Progress',
  relatedArticlesCollection: {
    total: 1,
    items: [{ sys: { id: 'article-1' }, doi: '10.1000/abc' }],
  },
  ...overrides,
});

describe('aims-milestones-reindex', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetClient.mockResolvedValue(mockClient);
  });

  describe('reindexMilestoneById', () => {
    test('builds and upserts a milestone document', async () => {
      const provider = createMockProvider();
      const project = makeProject();
      provider.fetchMilestoneById.mockResolvedValue(makeMilestone());
      provider.fetchAimIdsLinkedToMilestone.mockResolvedValue(['aim-1']);
      provider.fetchProjectWithAimsDetailByAimId.mockResolvedValue(project);

      await reindexMilestoneById(provider, 'ms-1');

      expect(mockUpsertOpensearchDocuments).toHaveBeenCalledWith(
        mockClient,
        'project-milestones',
        [
          expect.objectContaining({
            id: 'ms-1',
            description: 'First milestone',
            status: 'In Progress',
            aimNumbersAsc: '1',
            aimNumbersDesc: '1',
            projectId: 'project-1',
            projectName: 'Project Alpha',
            articleCount: 1,
          }),
        ],
      );
    });

    test('handles aim in supplement grant for milestone aimNumbers', async () => {
      const provider = createMockProvider();
      const project = makeProject({
        originalGrantAimsCollection: { items: [] },
        supplementGrant: {
          aimsCollection: {
            items: [
              {
                sys: { id: 'aim-s1' },
                description: 'Supplement aim',
              },
            ],
          },
        },
      });
      provider.fetchMilestoneById.mockResolvedValue(makeMilestone());
      provider.fetchAimIdsLinkedToMilestone.mockResolvedValue(['aim-s1']);
      provider.fetchProjectWithAimsDetailByAimId.mockResolvedValue(project);

      await reindexMilestoneById(provider, 'ms-1');

      expect(mockUpsertOpensearchDocuments).toHaveBeenCalledWith(
        mockClient,
        'project-milestones',
        [
          expect.objectContaining({
            grantType: 'supplement',
            aimNumbersAsc: '1',
          }),
        ],
      );
    });

    test('uses aimOrder 0 when aim not found in project collections', async () => {
      const provider = createMockProvider();
      const project = makeProject({
        originalGrantAimsCollection: { items: [] },
        supplementGrant: null,
      });
      provider.fetchMilestoneById.mockResolvedValue(makeMilestone());
      provider.fetchAimIdsLinkedToMilestone.mockResolvedValue(['aim-orphan']);
      provider.fetchProjectWithAimsDetailByAimId.mockResolvedValue(project);

      await reindexMilestoneById(provider, 'ms-1');

      expect(mockUpsertOpensearchDocuments).toHaveBeenCalledWith(
        mockClient,
        'project-milestones',
        [
          expect.objectContaining({
            aimNumbersAsc: '0',
          }),
        ],
      );
    });

    test('skips when milestone not found', async () => {
      const provider = createMockProvider();
      provider.fetchMilestoneById.mockResolvedValue(null);
      provider.fetchAimIdsLinkedToMilestone.mockResolvedValue([]);

      await reindexMilestoneById(provider, 'ms-missing');

      expect(mockUpsertOpensearchDocuments).not.toHaveBeenCalled();
    });
  });

  describe('reindexAimsByMilestoneId', () => {
    test('finds aims linked to milestone and rebuilds each', async () => {
      const provider = createMockProvider();
      provider.fetchAimIdsLinkedToMilestone.mockResolvedValue([
        'aim-1',
        'aim-2',
      ]);

      const project = makeProject({
        originalGrantAimsCollection: {
          items: [
            {
              sys: {
                id: 'aim-1',
                firstPublishedAt: '2025-01-01T00:00:00.000Z',
                publishedAt: '2025-06-01T00:00:00.000Z',
              },
              description: 'First aim',
            },
            {
              sys: {
                id: 'aim-2',
                firstPublishedAt: '2025-01-02T00:00:00.000Z',
                publishedAt: '2025-06-02T00:00:00.000Z',
              },
              description: 'Second aim',
            },
          ],
        },
      });
      provider.fetchProjectWithAimsDetailByAimId.mockResolvedValue(project);
      provider.fetchAimWithMilestonesById.mockResolvedValue({
        sys: { id: 'aim-1' },
        milestonesCollection: { items: [{ sys: { id: 'ms-1' } }] },
      });
      provider.fetchMilestoneById.mockResolvedValue(makeMilestone());

      await reindexAimsByMilestoneId(provider, 'ms-1');

      expect(provider.fetchAimIdsLinkedToMilestone).toHaveBeenCalledWith(
        'ms-1',
      );
      // Called once per aim
      expect(mockUpsertOpensearchDocuments).toHaveBeenCalledTimes(2);
    });

    test('handles aim found in supplement grant collection', async () => {
      const provider = createMockProvider();
      provider.fetchAimIdsLinkedToMilestone.mockResolvedValue(['aim-s1']);

      const project = makeProject({
        originalGrantAimsCollection: { items: [] },
        supplementGrant: {
          aimsCollection: {
            items: [
              {
                sys: {
                  id: 'aim-s1',
                  firstPublishedAt: '2025-03-01T00:00:00.000Z',
                  publishedAt: '2025-08-01T00:00:00.000Z',
                },
                description: 'Supplement aim',
              },
            ],
          },
        },
      });
      provider.fetchProjectWithAimsDetailByAimId.mockResolvedValue(project);
      provider.fetchAimWithMilestonesById.mockResolvedValue({
        sys: { id: 'aim-s1' },
        milestonesCollection: { items: [] },
      });

      await reindexAimsByMilestoneId(provider, 'ms-1');

      expect(mockUpsertOpensearchDocuments).toHaveBeenCalledWith(
        mockClient,
        'project-aims',
        [
          expect.objectContaining({
            id: 'aim-s1',
            grantType: 'supplement',
          }),
        ],
      );
    });

    test('skips when aim detail not found in project collections', async () => {
      const provider = createMockProvider();
      provider.fetchAimIdsLinkedToMilestone.mockResolvedValue(['aim-orphan']);

      const project = makeProject({
        originalGrantAimsCollection: { items: [] },
        supplementGrant: null,
      });
      provider.fetchProjectWithAimsDetailByAimId.mockResolvedValue(project);
      provider.fetchAimWithMilestonesById.mockResolvedValue({
        sys: { id: 'aim-orphan' },
        milestonesCollection: { items: [] },
      });

      await reindexAimsByMilestoneId(provider, 'ms-1');

      expect(mockUpsertOpensearchDocuments).not.toHaveBeenCalled();
    });

    test('skips when no aims are linked to the milestone', async () => {
      const provider = createMockProvider();
      provider.fetchAimIdsLinkedToMilestone.mockResolvedValue([]);

      await reindexAimsByMilestoneId(provider, 'ms-orphan');

      expect(mockGetClient).not.toHaveBeenCalled();
      expect(mockUpsertOpensearchDocuments).not.toHaveBeenCalled();
    });

    test('skips when project or aim not found', async () => {
      const provider = createMockProvider();
      provider.fetchAimIdsLinkedToMilestone.mockResolvedValue(['aim-1']);
      provider.fetchProjectWithAimsDetailByAimId.mockResolvedValue(null);
      provider.fetchAimWithMilestonesById.mockResolvedValue(null);

      await reindexAimsByMilestoneId(provider, 'ms-1');

      expect(mockUpsertOpensearchDocuments).not.toHaveBeenCalled();
    });
  });

  describe('reindexMilestonesByAimId', () => {
    test('finds milestones linked to aim and reindexes each', async () => {
      const provider = createMockProvider();
      provider.fetchAimWithMilestonesById.mockResolvedValue({
        sys: { id: 'aim-1' },
        milestonesCollection: {
          items: [{ sys: { id: 'ms-1' } }, { sys: { id: 'ms-2' } }],
        },
      });
      provider.fetchMilestoneById.mockResolvedValue(makeMilestone());
      provider.fetchAimIdsLinkedToMilestone.mockResolvedValue(['aim-1']);
      provider.fetchProjectWithAimsDetailByAimId.mockResolvedValue(
        makeProject(),
      );

      await reindexMilestonesByAimId(provider, 'aim-1');

      expect(mockUpsertOpensearchDocuments).toHaveBeenCalledTimes(2);
    });
  });

  describe('reindexByProjectId', () => {
    test('deletes all aims and milestones then reinserts from Contentful', async () => {
      const provider = createMockProvider();
      const project = makeProject();
      provider.fetchProjectWithAimsDetailById.mockResolvedValue(project);
      provider.fetchProjectWithAimsDetailByAimId.mockResolvedValue(project);
      provider.fetchAimWithMilestonesById.mockResolvedValue({
        sys: { id: 'aim-1' },
        milestonesCollection: { items: [{ sys: { id: 'ms-1' } }] },
      });
      provider.fetchMilestoneById.mockResolvedValue(makeMilestone());
      provider.fetchAimIdsLinkedToMilestone.mockResolvedValue(['aim-1']);

      await reindexByProjectId(provider, 'project-1');

      expect(provider.fetchProjectWithAimsDetailById).toHaveBeenCalledWith(
        'project-1',
      );

      // Deletes all aims and milestones for this project by projectId field
      expect(mockDeleteByFieldValue).toHaveBeenCalledWith(
        mockClient,
        'project-aims',
        'projectId',
        'project-1',
      );
      expect(mockDeleteByFieldValue).toHaveBeenCalledWith(
        mockClient,
        'project-milestones',
        'projectId',
        'project-1',
      );

      // Then reinserts aim and milestone
      expect(mockUpsertOpensearchDocuments).toHaveBeenCalledWith(
        mockClient,
        'project-aims',
        [expect.objectContaining({ id: 'aim-1' })],
      );
      expect(mockUpsertOpensearchDocuments).toHaveBeenCalledWith(
        mockClient,
        'project-milestones',
        [expect.objectContaining({ id: 'ms-1' })],
      );
    });

    test('skips when project not found', async () => {
      const provider = createMockProvider();
      provider.fetchProjectWithAimsDetailById.mockResolvedValue(null);

      await reindexByProjectId(provider, 'project-missing');

      expect(mockUpsertOpensearchDocuments).not.toHaveBeenCalled();
    });
  });

  describe('deleteAimById', () => {
    test('deletes aim from OpenSearch', async () => {
      await deleteAimById('aim-1');

      expect(mockDeleteByDocumentIds).toHaveBeenCalledWith(
        mockClient,
        'project-aims',
        ['aim-1'],
      );
    });
  });

  describe('deleteMilestoneById', () => {
    test('deletes milestone from OpenSearch', async () => {
      await deleteMilestoneById('ms-1');

      expect(mockDeleteByDocumentIds).toHaveBeenCalledWith(
        mockClient,
        'project-milestones',
        ['ms-1'],
      );
    });
  });

  describe('deleteByProjectId', () => {
    test('deletes all aims and milestones for a project by querying OpenSearch', async () => {
      await deleteByProjectId('project-1');

      expect(mockDeleteByFieldValue).toHaveBeenCalledWith(
        mockClient,
        'project-aims',
        'projectId',
        'project-1',
      );
      expect(mockDeleteByFieldValue).toHaveBeenCalledWith(
        mockClient,
        'project-milestones',
        'projectId',
        'project-1',
      );
    });
  });
});
