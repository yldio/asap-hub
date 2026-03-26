import { ProjectsOrder } from '@asap-hub/contentful';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import { getContentfulEnvironmentMock } from '../../mocks/contentful-rest-client.mock';
import { getEntry } from '../../fixtures/contentful.fixtures';
import {
  ProjectContentfulDataProvider,
  parseContentfulProject,
  parseContentfulProjectDetail,
  parseProjectUserMember,
  parseProjectTeamMember,
  parseContentfulAims,
  parseMilestonesFromAims,
  processTraineeProjectMembers,
  type ProjectMembershipItem,
} from '../../../src/data-providers/contentful/project.data-provider';
import { TraineeProject, TraineeProjectDetail } from '@asap-hub/model';
import { Environment } from '@asap-hub/contentful';
import {
  getExpectedDiscoveryProject,
  getExpectedDiscoveryProjectDetail,
  getExpectedDiscoveryProjectDetailWithAllFields,
  getExpectedDiscoveryProjectWithoutTeam,
  getExpectedProjectList,
  getExpectedResourceIndividualProject,
  getExpectedResourceTeamProject,
  getExpectedTraineeProject,
  getTraineeProjectGraphqlItem,
  getProjectByIdGraphqlResponse,
  getProjectsGraphqlEmptyResponse,
  getProjectsGraphqlResponse,
  getDiscoveryProjectByIdGraphqlItem,
  getDiscoveryProjectWithoutTeamGraphqlItem,
  getDiscoveryProjectGraphqlItem,
  getProjectsGraphqlResponseWithUnknownType,
  getResourceTeamProjectGraphqlItem,
  getResourceIndividualProjectGraphqlItem,
  getDiscoveryProjectDetailGraphqlItem,
  getResourceTeamProjectDetailGraphqlItem,
  getResourceIndividualProjectDetailGraphqlItem,
  getTraineeProjectDetailGraphqlItem,
  getSupplementGrantFields,
  getOriginalGrantFields,
} from '../../fixtures/projects.fixtures';

describe('ProjectContentfulDataProvider', () => {
  const contentfulClientMock = getContentfulGraphqlClientMock();
  const opensearchProviderMock = {
    search: jest.fn(),
  };
  const dataProvider = new ProjectContentfulDataProvider(
    contentfulClientMock,
    undefined,
    opensearchProviderMock as any,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('fetch', () => {
    it('maps filters into the Contentful query and parses all project types', async () => {
      contentfulClientMock.request.mockResolvedValueOnce(
        getProjectsGraphqlResponse(),
      );

      const result = await dataProvider.fetch({
        take: 5,
        skip: 10,
        search: 'brain health',
        filter: {
          projectType: ['Discovery Project', 'Resource Project'],
          status: ['Completed', 'Active'],
        },
      });

      expect(result).toEqual({
        total: 4,
        items: getExpectedProjectList(),
      });

      expect(contentfulClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          limit: 5,
          skip: 10,
          order: [ProjectsOrder.SysFirstPublishedAtDesc],
          where: {
            OR: [
              { title_contains: 'brain' },
              { title_contains: 'health' },
              { researchTags: { name_contains: 'brain' } },
              { researchTags: { name_contains: 'health' } },
              { resourceType: { name_contains: 'brain' } },
              { resourceType: { name_contains: 'health' } },
            ],
            projectType_in: ['Discovery Project', 'Resource Project'],
            status_in: ['Completed', 'Active'],
          },
        },
      );
    });

    it('normalises single-value filters', async () => {
      contentfulClientMock.request.mockResolvedValueOnce(
        getProjectsGraphqlResponse(),
      );

      await dataProvider.fetch({
        filter: {
          projectType: 'Discovery Project',
          status: 'Completed',
        },
      });

      expect(contentfulClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          limit: 10,
          skip: 0,
          order: [ProjectsOrder.SysFirstPublishedAtDesc],
          where: {
            projectType_in: ['Discovery Project'],
            status_in: ['Completed'],
          },
        }),
      );
    });

    it('returns an empty list when Contentful has no projects', async () => {
      contentfulClientMock.request.mockResolvedValueOnce(
        getProjectsGraphqlEmptyResponse(),
      );

      const result = await dataProvider.fetch({});

      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });

    it('falls back to default discovery project values when no team member exists', async () => {
      contentfulClientMock.request.mockResolvedValueOnce({
        projectsCollection: {
          total: 1,
          items: [getDiscoveryProjectWithoutTeamGraphqlItem()],
        },
      } as never);

      const result = await dataProvider.fetch({});

      expect(result.items).toEqual([getExpectedDiscoveryProjectWithoutTeam()]);
    });
  });

  describe('fetchById', () => {
    const emptySearchResponse = { hits: { hits: [] } };

    beforeEach(() => {
      opensearchProviderMock.search.mockResolvedValue(emptySearchResponse);
    });

    it('returns a parsed project when the entry exists', async () => {
      contentfulClientMock.request.mockResolvedValueOnce(
        getProjectByIdGraphqlResponse(),
      );

      const result = await dataProvider.fetchById('discovery-1');

      expect(result).toEqual(getExpectedDiscoveryProjectDetail());
    });

    it('fetches aims from OpenSearch and maps articleCount and status', async () => {
      contentfulClientMock.request.mockResolvedValueOnce(
        getProjectByIdGraphqlResponse(),
      );
      opensearchProviderMock.search
        .mockResolvedValueOnce({
          hits: {
            hits: [
              {
                _source: {
                  id: 'aim-1',
                  description: 'First aim',
                  status: 'Complete',
                  articleCount: 4,
                },
              },
              {
                _source: {
                  id: 'aim-2',
                  description: 'Second aim',
                  status: 'In Progress',
                  articleCount: 2,
                },
              },
            ],
          },
        })
        .mockResolvedValueOnce(emptySearchResponse);

      const result = await dataProvider.fetchById('project-with-aims');

      expect(contentfulClientMock.request).toHaveBeenCalledTimes(1);
      expect(opensearchProviderMock.search).toHaveBeenCalledWith(
        expect.objectContaining({
          index: 'project-aims',
          body: expect.objectContaining({
            query: {
              bool: {
                filter: [
                  { term: { projectId: 'project-with-aims' } },
                  { term: { grantType: 'original' } },
                ],
              },
            },
          }),
        }),
      );
      expect(opensearchProviderMock.search).toHaveBeenCalledWith(
        expect.objectContaining({
          index: 'project-aims',
          body: expect.objectContaining({
            query: {
              bool: {
                filter: [
                  { term: { projectId: 'project-with-aims' } },
                  { term: { grantType: 'supplement' } },
                ],
              },
            },
          }),
        }),
      );
      expect(result).not.toBeNull();
      const originalGrantAims = (result as any).originalGrantAims;
      expect(originalGrantAims).toHaveLength(2);
      expect(originalGrantAims[0]).toMatchObject({
        id: 'aim-1',
        order: 1,
        articleCount: 4,
        status: 'Complete',
      });
      expect(originalGrantAims[1]).toMatchObject({
        id: 'aim-2',
        order: 2,
        articleCount: 2,
        status: 'In Progress',
      });
    });

    it('sets originalGrantAims to undefined when OpenSearch returns no aims', async () => {
      contentfulClientMock.request.mockResolvedValueOnce(
        getProjectByIdGraphqlResponse(),
      );

      const result = await dataProvider.fetchById('discovery-1');

      expect((result as any).originalGrantAims).toBeUndefined();
    });

    it('handles null hits.hits gracefully (returns empty aims)', async () => {
      contentfulClientMock.request.mockResolvedValueOnce(
        getProjectByIdGraphqlResponse(),
      );
      opensearchProviderMock.search.mockResolvedValueOnce({ hits: {} });
      opensearchProviderMock.search.mockResolvedValueOnce({ hits: {} });

      const result = await dataProvider.fetchById('discovery-1');

      expect((result as any).originalGrantAims).toBeUndefined();
    });

    it('maps supplement grant aims when the project has a supplement grant', async () => {
      contentfulClientMock.request.mockResolvedValueOnce({
        projects: {
          ...getDiscoveryProjectByIdGraphqlItem(),
          supplementGrant: {
            grantTitle: 'Supplement Grant',
            grantDescription: 'Supplement description',
            grantProposalId: 'proposal-2',
            grantStartDate: '2024-06-01',
            grantEndDate: '2025-06-01',
          },
        },
      });
      opensearchProviderMock.search
        .mockResolvedValueOnce(emptySearchResponse)
        .mockResolvedValueOnce({
          hits: {
            hits: [
              {
                _source: {
                  id: 'sup-aim-1',
                  description: 'Supplement aim',
                  status: 'Active',
                  articleCount: 1,
                },
              },
            ],
          },
        });

      const result = await dataProvider.fetchById('project-with-supplement');

      expect(result).not.toBeNull();
      const supplementGrant = (result as any).supplementGrant;
      expect(supplementGrant).toBeDefined();
      expect(supplementGrant.aims).toHaveLength(1);
      expect(supplementGrant.aims[0]).toMatchObject({
        id: 'sup-aim-1',
        order: 1,
        status: 'Active',
        articleCount: 1,
      });
    });

    it('returns null when Contentful does not return the project', async () => {
      contentfulClientMock.request.mockResolvedValueOnce({ projects: null });

      const result = await dataProvider.fetchById('missing');

      expect(result).toBeNull();
    });

    it('returns null when a request fails', async () => {
      contentfulClientMock.request.mockRejectedValueOnce(
        new Error('Network error'),
      );

      const result = await dataProvider.fetchById('any-id');

      expect(result).toBeNull();
    });
  });

  it('parses each concrete project type into the expected model', () => {
    contentfulClientMock.request.mockResolvedValueOnce(
      getProjectsGraphqlResponse(),
    );

    return dataProvider.fetch({}).then((result) => {
      expect(result.items).toEqual([
        getExpectedDiscoveryProject(),
        getExpectedResourceTeamProject(),
        getExpectedResourceIndividualProject(),
        getExpectedTraineeProject(),
      ]);
    });
  });

  it('throws when project type is not Discovery Project, Resource Project, or Trainee Project', () => {
    const invalidItem = {
      ...getDiscoveryProjectGraphqlItem(),
      projectType: 'Unexpected Project Type',
    };

    expect(() => parseContentfulProject(invalidItem as never)).toThrow(
      'Unknown project type: Unexpected Project Type',
    );
  });

  it('throws when fetch encounters an unknown project type', async () => {
    contentfulClientMock.request.mockResolvedValueOnce(
      getProjectsGraphqlResponseWithUnknownType(),
    );

    await expect(dataProvider.fetch({})).rejects.toThrow(
      'Unknown project type: Unknown Project',
    );
  });

  it('groups trainee project members by role correctly', () => {
    const traineeProjectWithMultipleRoles = {
      ...getTraineeProjectGraphqlItem(),
      sys: { id: 'trainee-multi-role' },
      membersCollection: {
        total: 5,
        items: [
          {
            sys: { id: 'membership-trainee-1' },
            role: 'Trainee Project - Lead',
            projectMember: {
              __typename: 'Users',
              sys: { id: 'user-trainee-1' },
              firstName: 'Trainee',
              nickname: '',
              lastName: 'One',
              email: 'trainee1@example.com',
              onboarded: true,
              avatar: { url: null },
              alumniSinceDate: undefined,
            },
          },
          {
            sys: { id: 'membership-trainee-2' },
            role: 'Trainee Project - Lead',
            projectMember: {
              __typename: 'Users',
              sys: { id: 'user-trainee-2' },
              firstName: 'Trainee',
              nickname: '',
              lastName: 'Two',
              email: 'trainee2@example.com',
              onboarded: true,
              avatar: { url: null },
              alumniSinceDate: undefined,
            },
          },
          {
            sys: { id: 'membership-mentor-1' },
            role: 'Trainee Project - Mentor',
            projectMember: {
              __typename: 'Users',
              sys: { id: 'user-mentor-1' },
              firstName: 'Mentor',
              nickname: '',
              lastName: 'One',
              email: 'mentor1@example.com',
              onboarded: true,
              avatar: { url: null },
              alumniSinceDate: undefined,
            },
          },
          {
            sys: { id: 'membership-mentor-2' },
            role: 'Trainee Project - Mentor',
            projectMember: {
              __typename: 'Users',
              sys: { id: 'user-mentor-2' },
              firstName: 'Mentor',
              nickname: '',
              lastName: 'Two',
              email: 'mentor2@example.com',
              onboarded: true,
              avatar: { url: null },
              alumniSinceDate: undefined,
            },
          },
          {
            sys: { id: 'membership-key-personnel' },
            role: 'Trainee Project - Key Personnel',
            projectMember: {
              __typename: 'Users',
              sys: { id: 'user-key-personnel' },
              firstName: 'Key',
              nickname: '',
              lastName: 'Personnel',
              email: 'key@example.com',
              onboarded: true,
              avatar: { url: null },
              alumniSinceDate: undefined,
            },
          },
        ],
      },
    } as ReturnType<typeof getTraineeProjectGraphqlItem>;

    const result = parseContentfulProject(
      traineeProjectWithMultipleRoles,
    ) as TraineeProject;

    // Members should include all: trainees first, then mentors
    expect(result.members).toHaveLength(5);

    // Check trainees (Trainee Project - Lead) are first
    expect(result.members[0]).toMatchObject({
      id: 'user-trainee-1',
      role: 'Trainee Project - Lead',
    });
    expect(result.members[1]).toMatchObject({
      id: 'user-trainee-2',
      role: 'Trainee Project - Lead',
    });

    // Check mentors follow (Trainee Project - Mentor and Trainee Project - Key Personnel)
    expect(result.members[2]).toMatchObject({
      id: 'user-mentor-1',
      role: 'Trainee Project - Mentor',
    });
    expect(result.members[3]).toMatchObject({
      id: 'user-mentor-2',
      role: 'Trainee Project - Mentor',
    });
    expect(result.members[4]).toMatchObject({
      id: 'user-key-personnel',
      role: 'Trainee Project - Key Personnel',
    });
  });

  it('includes multiple trainees when only trainee roles are present', () => {
    const traineeWithoutMentors = {
      ...getTraineeProjectGraphqlItem(),
      sys: { id: 'trainee-no-mentors' },
      membersCollection: {
        total: 2,
        items: [
          {
            sys: { id: 'membership-trainee-1' },
            role: 'Trainee Project - Lead',
            projectMember: {
              __typename: 'Users',
              sys: { id: 'user-primary' },
              firstName: 'Morgan',
              nickname: '',
              lastName: 'Hill',
              email: 'morgan@example.com',
              onboarded: true,
              avatar: { url: null },
              alumniSinceDate: undefined,
            },
          },
          {
            sys: { id: 'membership-trainee-2' },
            role: 'Trainee Project - Lead',
            projectMember: {
              __typename: 'Users',
              sys: { id: 'user-secondary' },
              firstName: 'Riley',
              nickname: '',
              lastName: 'Poe',
              email: 'riley@example.com',
              onboarded: true,
              avatar: { url: null },
              alumniSinceDate: undefined,
            },
          },
        ],
      },
    } as ReturnType<typeof getTraineeProjectGraphqlItem>;

    const result = parseContentfulProject(
      traineeWithoutMentors,
    ) as TraineeProject;

    // Should include all members (both trainees)
    expect(result.members).toHaveLength(2);
    expect(result.members[0]).toMatchObject({
      id: 'user-primary',
      role: 'Trainee Project - Lead',
    });
    expect(result.members[1]).toMatchObject({
      id: 'user-secondary',
      role: 'Trainee Project - Lead',
    });
  });

  it('falls back to an unknown trainer when no user members are available', () => {
    const traineeWithoutUsers = {
      ...getTraineeProjectGraphqlItem(),
      sys: { id: 'trainee-empty' },
      membersCollection: {
        total: 1,
        items: [
          {
            sys: { id: 'membership-trainee-team' },
            role: 'Supporting Team',
            projectMember: {
              __typename: 'Teams',
              sys: { id: 'team-support' },
              displayName: 'Support Team',
              inactiveSince: null,
              researchTheme: null,
            },
          },
        ],
      },
    } as ReturnType<typeof getTraineeProjectGraphqlItem>;

    const result = parseContentfulProject(
      traineeWithoutUsers,
    ) as TraineeProject;

    // When no user members exist, members array should be empty
    expect(result.members).toHaveLength(0);
  });
});

describe('parseContentfulProject - tools parsing', () => {
  it('parses tools from toolsCollection', () => {
    const item = {
      ...getDiscoveryProjectGraphqlItem(),
      toolsCollection: {
        items: [
          {
            sys: { id: 'tool-1' },
            name: 'Slack',
            url: 'https://slack.com',
            description: 'Team communication',
          },
          {
            sys: { id: 'tool-2' },
            name: 'GitHub',
            url: 'https://github.com',
            description: null,
          },
        ],
      },
    };

    const result = parseContentfulProject(item as never);

    expect(result.tools).toEqual([
      {
        id: 'tool-1',
        name: 'Slack',
        url: 'https://slack.com',
        description: 'Team communication',
      },
      {
        id: 'tool-2',
        name: 'GitHub',
        url: 'https://github.com',
        description: undefined,
      },
    ]);
  });

  it('returns undefined for tools when toolsCollection is empty', () => {
    const item = {
      ...getDiscoveryProjectGraphqlItem(),
      toolsCollection: { items: [] },
    };

    const result = parseContentfulProject(item as never);

    expect(result.tools).toBeUndefined();
  });

  it('filters out tools missing name or url', () => {
    const item = {
      ...getDiscoveryProjectGraphqlItem(),
      toolsCollection: {
        items: [
          null,
          {
            sys: { id: 'tool-no-url' },
            name: 'No URL',
            url: null,
            description: null,
          },
          {
            sys: { id: 'tool-no-name' },
            name: null,
            url: 'https://example.com',
            description: null,
          },
          {
            sys: { id: 'tool-valid' },
            name: 'Valid',
            url: 'https://valid.com',
            description: null,
          },
        ],
      },
    };

    const result = parseContentfulProject(item as never);

    expect(result.tools).toEqual([
      {
        id: 'tool-valid',
        name: 'Valid',
        url: 'https://valid.com',
        description: undefined,
      },
    ]);
  });
});

describe('ProjectContentfulDataProvider - update', () => {
  const contentfulClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const dataProvider = new ProjectContentfulDataProvider(
    contentfulClientMock,
    contentfulRestClientMock,
  );

  const dataProviderWithoutRestClient = new ProjectContentfulDataProvider(
    contentfulClientMock,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('throws when REST client is not configured', async () => {
    await expect(
      dataProviderWithoutRestClient.update('project-1', { tools: [] }),
    ).rejects.toThrow(
      'REST client not configured for ProjectContentfulDataProvider',
    );
  });

  it('creates a new tool when no id is provided', async () => {
    const projectId = 'project-1';
    const tool = {
      name: 'Slack',
      url: 'https://slack.com',
      description: 'Team communication',
    };

    const projectMock = getEntry({});
    environmentMock.getEntry.mockResolvedValueOnce(projectMock);

    const toolMock = getEntry({});
    environmentMock.createEntry.mockResolvedValueOnce(toolMock);
    toolMock.publish = jest.fn().mockResolvedValueOnce(toolMock);

    const projectMockUpdated = getEntry({});
    projectMock.patch = jest.fn().mockResolvedValueOnce(projectMockUpdated);

    await dataProvider.update(projectId, { tools: [tool] });

    expect(environmentMock.getEntry).toHaveBeenCalledWith(projectId);
    expect(environmentMock.createEntry).toHaveBeenCalledWith('externalTools', {
      fields: {
        name: { 'en-US': tool.name },
        url: { 'en-US': tool.url },
        description: { 'en-US': tool.description },
      },
    });
    expect(projectMockUpdated.publish).toHaveBeenCalled();
  });

  it('updates an existing tool when id is provided', async () => {
    const projectId = 'project-1';
    const tool = {
      id: 'existing-tool-id',
      name: 'Updated Slack',
      url: 'https://slack.com/updated',
      description: 'Updated description',
    };

    const projectMock = getEntry({});
    environmentMock.getEntry.mockResolvedValueOnce(projectMock);

    const toolEntryMock = getEntry({});
    toolEntryMock.sys.id = tool.id;
    toolEntryMock.update = jest.fn().mockResolvedValueOnce(toolEntryMock);
    toolEntryMock.publish = jest.fn().mockResolvedValueOnce(toolEntryMock);
    environmentMock.getEntry.mockResolvedValueOnce(toolEntryMock);

    const projectMockUpdated = getEntry({});
    projectMock.patch = jest.fn().mockResolvedValueOnce(projectMockUpdated);

    await dataProvider.update(projectId, { tools: [tool] });

    expect(environmentMock.getEntry).toHaveBeenCalledWith(projectId);
    expect(environmentMock.getEntry).toHaveBeenCalledWith(tool.id);
    expect(toolEntryMock.update).toHaveBeenCalled();
    expect(toolEntryMock.publish).toHaveBeenCalled();
    expect(environmentMock.createEntry).not.toHaveBeenCalled();
  });

  it('deletes tools that are no longer in the incoming list', async () => {
    const projectId = 'project-1';
    const tool = {
      name: 'New Tool',
      url: 'https://new-tool.com',
    };

    const projectMock = getEntry({
      tools: {
        'en-US': [
          { sys: { id: 'old-tool-1', linkType: 'Entry', type: 'Link' } },
          { sys: { id: 'old-tool-2', linkType: 'Entry', type: 'Link' } },
        ],
      },
    });
    environmentMock.getEntry.mockResolvedValueOnce(projectMock);

    const oldTool1Mock = getEntry({});
    oldTool1Mock.unpublish = jest.fn().mockResolvedValueOnce(oldTool1Mock);
    oldTool1Mock.delete = jest.fn().mockResolvedValueOnce(undefined);
    environmentMock.getEntry.mockResolvedValueOnce(oldTool1Mock);

    const oldTool2Mock = getEntry({});
    oldTool2Mock.unpublish = jest.fn().mockResolvedValueOnce(oldTool2Mock);
    oldTool2Mock.delete = jest.fn().mockResolvedValueOnce(undefined);
    environmentMock.getEntry.mockResolvedValueOnce(oldTool2Mock);

    const toolMock = getEntry({});
    toolMock.sys.id = 'new-tool';
    environmentMock.createEntry.mockResolvedValueOnce(toolMock);
    toolMock.publish = jest.fn().mockResolvedValueOnce(toolMock);

    const projectMockUpdated = getEntry({});
    projectMock.patch = jest.fn().mockResolvedValueOnce(projectMockUpdated);

    await dataProvider.update(projectId, { tools: [tool] });

    expect(environmentMock.getEntry).toHaveBeenCalledWith('old-tool-1');
    expect(environmentMock.getEntry).toHaveBeenCalledWith('old-tool-2');
    expect(oldTool1Mock.unpublish).toHaveBeenCalled();
    expect(oldTool1Mock.delete).toHaveBeenCalled();
    expect(oldTool2Mock.unpublish).toHaveBeenCalled();
    expect(oldTool2Mock.delete).toHaveBeenCalled();
    expect(projectMockUpdated.publish).toHaveBeenCalled();
  });

  it('strips blank description from tool payload', async () => {
    const projectId = 'project-1';
    const tool = {
      name: 'Clean Tool',
      url: 'https://clean.com',
      description: '   ',
    };

    const projectMock = getEntry({});
    environmentMock.getEntry.mockResolvedValueOnce(projectMock);

    const toolMock = getEntry({});
    environmentMock.createEntry.mockResolvedValueOnce(toolMock);
    toolMock.publish = jest.fn().mockResolvedValueOnce(toolMock);

    const projectMockUpdated = getEntry({});
    projectMock.patch = jest.fn().mockResolvedValueOnce(projectMockUpdated);

    await dataProvider.update(projectId, { tools: [tool] });

    expect(environmentMock.createEntry).toHaveBeenCalledWith('externalTools', {
      fields: {
        name: { 'en-US': tool.name },
        url: { 'en-US': tool.url },
      },
    });
  });
});

describe('parseContentfulProject', () => {
  it('parses a team-based resource project', () => {
    const resourceTeamItem = {
      ...getResourceTeamProjectGraphqlItem(),
      projectType: 'Resource Project',
    };

    const result = parseContentfulProject(resourceTeamItem as never);

    expect(result).toEqual(getExpectedResourceTeamProject());
  });

  it('parses an individual resource project with user members', () => {
    const resourceIndividualItem = {
      ...getResourceIndividualProjectGraphqlItem(),
      projectType: 'Resource Project',
    };

    const result = parseContentfulProject(resourceIndividualItem as never);

    expect(result).toEqual(getExpectedResourceIndividualProject());
  });
});

describe('parseProjectUserMember', () => {
  it('formats user membership details when typename matches Users', () => {
    const membership = {
      sys: { id: 'membership-users-1' },
      role: 'Contributor',
      projectMember: {
        __typename: 'Users',
        sys: { id: 'user-1' },
        firstName: 'Taylor',
        lastName: 'Swift',
        nickname: 'T',
        email: 'taylor@example.com',
        avatar: { url: 'https://example.com/avatar.png' },
        alumniSinceDate: '2024-01-01',
      },
    } as unknown as ProjectMembershipItem;

    expect(parseProjectUserMember(membership)).toEqual({
      id: 'user-1',
      displayName: 'Taylor (T) Swift',
      firstName: 'Taylor',
      lastName: 'Swift',
      avatarUrl: 'https://example.com/avatar.png',
      role: 'Contributor',
      email: 'taylor@example.com',
      alumniSinceDate: '2024-01-01',
    });
  });

  it('returns placeholder when membership is not a user', () => {
    const membership = {
      sys: { id: 'membership-users-2' },
      role: 'Contributor',
      projectMember: {
        __typename: 'Teams',
      },
    } as unknown as ProjectMembershipItem;

    expect(parseProjectUserMember(membership)).toEqual({
      id: 'unknown-user-membership-users-2',
      displayName: '',
    });
  });
});

describe('parseProjectTeamMember', () => {
  it('formats team membership details when typename matches Teams', () => {
    const membership = {
      sys: { id: 'membership-teams-1' },
      projectMember: {
        __typename: 'Teams',
        sys: { id: 'team-1' },
        displayName: 'Awesome Team',
      },
    } as unknown as ProjectMembershipItem;

    expect(parseProjectTeamMember(membership)).toEqual({
      id: 'team-1',
      displayName: 'Awesome Team',
    });
  });

  it('returns placeholder when membership is not a team', () => {
    const membership = {
      sys: { id: 'membership-teams-2' },
      projectMember: {
        __typename: 'WrongType',
        sys: { id: 'user-2' },
      },
    } as unknown as ProjectMembershipItem;

    expect(parseProjectTeamMember(membership)).toEqual({
      id: 'unknown-team-membership-teams-2',
      displayName: '',
    });
  });
});

describe('parseContentfulAims', () => {
  it('returns undefined for undefined input', () => {
    expect(parseContentfulAims(undefined)).toBeUndefined();
  });

  it('returns undefined for array of all null items', () => {
    expect(parseContentfulAims([null, null])).toBeUndefined();
  });

  it('returns undefined for items with empty descriptions', () => {
    expect(
      parseContentfulAims([
        { sys: { id: 'aim-1' }, description: '' },
        { sys: { id: 'aim-2' }, description: '   ' },
      ]),
    ).toBeUndefined();
  });

  it('filters out null items and items with empty descriptions', () => {
    const result = parseContentfulAims([
      null,
      { sys: { id: 'aim-1' }, description: '' },
      { sys: { id: 'aim-2' }, description: 'Valid aim' },
      null,
      { sys: { id: 'aim-3' }, description: '   ' },
      { sys: { id: 'aim-4' }, description: 'Another valid aim' },
    ]);

    expect(result).toHaveLength(2);
    expect(result).toEqual([
      expect.objectContaining({ id: 'aim-2', description: 'Valid aim' }),
      expect.objectContaining({
        id: 'aim-4',
        description: 'Another valid aim',
      }),
    ]);
  });

  it('returns properly shaped aims with sequential order starting at 1', () => {
    const result = parseContentfulAims([
      { sys: { id: 'aim-1' }, description: 'First aim' },
      { sys: { id: 'aim-2' }, description: 'Second aim' },
      { sys: { id: 'aim-3' }, description: 'Third aim' },
    ]);

    expect(result).toEqual([
      {
        id: 'aim-1',
        order: 1,
        description: 'First aim',
        status: 'Pending',
        articleCount: 0,
      },
      {
        id: 'aim-2',
        order: 2,
        description: 'Second aim',
        status: 'Pending',
        articleCount: 0,
      },
      {
        id: 'aim-3',
        order: 3,
        description: 'Third aim',
        status: 'Pending',
        articleCount: 0,
      },
    ]);
  });

  it('trims whitespace from descriptions', () => {
    const result = parseContentfulAims([
      { sys: { id: 'aim-1' }, description: '  Padded aim  ' },
    ]);

    expect(result).toEqual([
      expect.objectContaining({ description: 'Padded aim' }),
    ]);
  });

  it('sums article totals across milestones for articleCount', () => {
    const result = parseContentfulAims([
      {
        sys: { id: 'aim-1' },
        description: 'First aim',
        milestonesCollection: {
          items: [
            { status: 'Complete', relatedArticlesCollection: { total: 3 } },
            { status: 'Complete', relatedArticlesCollection: { total: 4 } },
          ],
        },
      },
    ]);

    expect(result![0]).toMatchObject({ articleCount: 7 });
  });

  it('sets articleCount to 0 when aim has no milestones', () => {
    const result = parseContentfulAims([
      { sys: { id: 'aim-1' }, description: 'Test aim' },
    ]);

    expect(result![0]).toMatchObject({ articleCount: 0 });
  });

  describe('deriveAimStatus', () => {
    const aim = (statuses: string[]) => {
      const result = parseContentfulAims([
        {
          sys: { id: 'aim-1' },
          description: 'Test aim',
          milestonesCollection: {
            items: statuses.map((status) => ({
              status,
              relatedArticlesCollection: { total: 0 },
            })),
          },
        },
      ]);
      if (!result?.[0]) throw new Error('Expected aim to be defined');
      return result[0].status;
    };

    it('returns Pending when aim has no milestones', () => {
      const result = parseContentfulAims([
        { sys: { id: 'aim-1' }, description: 'Test aim' },
      ]);
      expect(result![0]).toMatchObject({ status: 'Pending' });
    });

    it('returns Pending when all milestones are Pending', () => {
      expect(aim(['Pending', 'Pending'])).toBe('Pending');
    });

    it('returns Complete when all milestones are Complete', () => {
      expect(aim(['Complete', 'Complete'])).toBe('Complete');
    });

    it('returns Terminated when all milestones are Terminated', () => {
      expect(aim(['Terminated', 'Terminated'])).toBe('Terminated');
    });

    it('returns In Progress when at least one milestone is In Progress', () => {
      expect(aim(['Complete', 'In Progress'])).toBe('In Progress');
    });

    it('returns In Progress when some are Complete and others are Pending', () => {
      expect(aim(['Complete', 'Pending'])).toBe('In Progress');
    });

    it('returns In Progress when some are Terminated and others are Pending', () => {
      expect(aim(['Terminated', 'Pending'])).toBe('In Progress');
    });

    it('returns Complete when some are Complete and others are Terminated', () => {
      expect(aim(['Complete', 'Terminated'])).toBe('Complete');
    });

    it('returns In Progress for a mix of Complete, Terminated, and Pending', () => {
      expect(aim(['Complete', 'Terminated', 'Pending'])).toBe('In Progress');
    });
  });
});

describe('processTraineeProjectMembers', () => {
  it('filters and orders members correctly: trainees first, then mentors', () => {
    const members: ProjectMembershipItem[] = [
      {
        sys: { id: 'membership-mentor-1' },
        role: 'Trainee Project - Mentor',
        projectMember: {
          __typename: 'Users',
          sys: { id: 'user-mentor-1' },
          firstName: 'Mentor',
          nickname: '',
          lastName: 'One',
          email: 'mentor1@example.com',
          onboarded: true,
          avatar: { url: null },
          alumniSinceDate: undefined,
        },
      },
      {
        sys: { id: 'membership-trainee-1' },
        role: 'Trainee Project - Lead',
        projectMember: {
          __typename: 'Users',
          sys: { id: 'user-trainee-1' },
          firstName: 'Trainee',
          nickname: '',
          lastName: 'One',
          email: 'trainee1@example.com',
          onboarded: true,
          avatar: { url: null },
          alumniSinceDate: undefined,
        },
      },
      {
        sys: { id: 'membership-key-personnel' },
        role: 'Trainee Project - Key Personnel',
        projectMember: {
          __typename: 'Users',
          sys: { id: 'user-key-personnel' },
          firstName: 'Key',
          nickname: '',
          lastName: 'Personnel',
          email: 'key@example.com',
          onboarded: true,
          avatar: { url: null },
          alumniSinceDate: undefined,
        },
      },
      {
        sys: { id: 'membership-trainee-2' },
        role: 'Trainee Project - Lead',
        projectMember: {
          __typename: 'Users',
          sys: { id: 'user-trainee-2' },
          firstName: 'Trainee',
          nickname: '',
          lastName: 'Two',
          email: 'trainee2@example.com',
          onboarded: true,
          avatar: { url: null },
          alumniSinceDate: undefined,
        },
      },
      {
        sys: { id: 'membership-team' },
        role: 'Supporting Team',
        projectMember: {
          __typename: 'Teams',
          sys: { id: 'team-support' },
          displayName: 'Support Team',
          inactiveSince: null,
          researchTheme: null,
        },
      },
      {
        sys: { id: 'membership-invalid-role' },
        role: 'Invalid Role',
        projectMember: {
          __typename: 'Users',
          sys: { id: 'user-invalid' },
          firstName: 'Invalid',
          nickname: '',
          lastName: 'Role',
          email: 'invalid@example.com',
          onboarded: true,
          avatar: { url: null },
          alumniSinceDate: undefined,
        },
      },
    ] as ProjectMembershipItem[];

    const result = processTraineeProjectMembers(members);

    // Should only include valid roles (Trainee Project - Lead, Mentor, Key Personnel)
    // Should exclude Teams and invalid roles
    expect(result).toHaveLength(4);

    // Trainees should come first
    expect(result[0]).toMatchObject({
      id: 'user-trainee-1',
      role: 'Trainee Project - Lead',
    });
    expect(result[1]).toMatchObject({
      id: 'user-trainee-2',
      role: 'Trainee Project - Lead',
    });

    // Mentors should come after
    expect(result[2]).toMatchObject({
      id: 'user-mentor-1',
      role: 'Trainee Project - Mentor',
    });
    expect(result[3]).toMatchObject({
      id: 'user-key-personnel',
      role: 'Trainee Project - Key Personnel',
    });
  });

  it('returns empty array when no valid members exist', () => {
    const members: ProjectMembershipItem[] = [
      {
        sys: { id: 'membership-team' },
        role: 'Supporting Team',
        projectMember: {
          __typename: 'Teams',
          sys: { id: 'team-support' },
          displayName: 'Support Team',
          inactiveSince: null,
          researchTheme: null,
        },
      },
      {
        sys: { id: 'membership-invalid-role' },
        role: 'Invalid Role',
        projectMember: {
          __typename: 'Users',
          sys: { id: 'user-invalid' },
          firstName: 'Invalid',
          nickname: '',
          lastName: 'Role',
          email: 'invalid@example.com',
          onboarded: true,
          avatar: { url: null },
          alumniSinceDate: undefined,
        },
      },
    ] as ProjectMembershipItem[];

    const result = processTraineeProjectMembers(members);

    expect(result).toHaveLength(0);
  });
});

describe('parseContentfulProjectDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('parses Discovery Project detail with originalGrant and supplementGrant', () => {
    const discoveryItem = getDiscoveryProjectDetailGraphqlItem({
      originalGrant: 'Original Grant Title',
      proposalId: 'proposal-1',
      supplementGrant: getSupplementGrantFields({
        id: 'supplement-1',
        title: 'Supplement Grant Title',
        description: 'Supplement grant description',
        startDate: '2024-06-01',
        endDate: '2025-06-01',
        proposalId: 'proposal-2',
      }),
      teamDescription: 'Team description for discovery',
    });

    const result = parseContentfulProjectDetail(discoveryItem);

    expect(result).toMatchObject(
      getExpectedDiscoveryProjectDetailWithAllFields(),
    );
  });

  it('parses Discovery Project detail without supplementGrant or teamDescription', () => {
    const discoveryItem = getDiscoveryProjectDetailGraphqlItem({
      originalGrant: 'Original Grant',
      proposalId: null,
      supplementGrant: null,
      teamDescription: null,
    });

    const result = parseContentfulProjectDetail(discoveryItem);

    expect(result).toMatchObject({
      originalGrant: 'Original Grant',
      originalGrantProposalId: undefined,
      supplementGrant: undefined,
      fundedTeam: {
        teamDescription: undefined,
      },
    });
  });

  it('parses Resource Project detail (team-based) with teamDescription', () => {
    const resourceItem = getResourceTeamProjectDetailGraphqlItem({
      originalGrant: 'Resource Original Grant',
      proposalId: 'resource-proposal-1',
      supplementGrant: getSupplementGrantFields({
        id: 'resource-supplement-1',
        title: 'Resource Supplement',
        description: 'Resource supplement description',
        startDate: '2024-01-01',
        endDate: '2025-01-01',
        proposalId: 'resource-proposal-2',
      }),
      teamDescription: 'Resource team description',
    });

    const result = parseContentfulProjectDetail(resourceItem);

    expect(result).toMatchObject({
      id: 'resource-team-1',
      projectType: 'Resource Project',
      originalGrant: 'Resource Original Grant',
      originalGrantProposalId: 'resource-proposal-1',
      supplementGrant: {
        grantTitle: 'Resource Supplement',
        grantDescription: 'Resource supplement description',
        grantProposalId: 'resource-proposal-2',
        grantStartDate: '2024-01-01',
        grantEndDate: '2025-01-01',
      },
      fundedTeam: {
        id: 'resource-team-main',
        displayName: 'Resource Team',
        teamType: 'Resource Team',
        researchTheme: 'Resource Theme',
        teamDescription: 'Resource team description',
      },
      collaborators: [
        {
          id: 'user-resource-1',
          displayName: 'Resource User',
        },
      ],
    });
  });

  it('parses Resource Project detail (non-team-based) with user members', () => {
    const resourceItem = getResourceIndividualProjectDetailGraphqlItem({
      originalGrant: 'Individual Resource Grant',
      proposalId: 'individual-proposal-1',
      supplementGrant: null,
    });

    const result = parseContentfulProjectDetail(resourceItem);

    expect(result).toMatchObject({
      id: 'resource-individual-1',
      projectType: 'Resource Project',
      originalGrant: 'Individual Resource Grant',
      originalGrantProposalId: 'individual-proposal-1',
      supplementGrant: undefined,
      members: [
        {
          id: 'user-2',
          displayName: 'Jamie Lee',
        },
        {
          id: 'user-3',
          displayName: 'Pat (Patty) Stone',
        },
      ],
    });
    expect(result).not.toHaveProperty('fundedTeam');
  });

  it('parses Trainee Project detail with grants', () => {
    const traineeItem = getTraineeProjectDetailGraphqlItem({
      originalGrant: 'Trainee Original Grant',
      proposalId: 'trainee-proposal-1',
      supplementGrant: getSupplementGrantFields({
        id: 'trainee-supplement-1',
        title: 'Trainee Supplement',
        description: 'Trainee supplement description',
        startDate: '2024-06-01',
        endDate: '2025-06-01',
        proposalId: 'trainee-proposal-2',
      }),
    });

    const result = parseContentfulProjectDetail(
      traineeItem,
    ) as TraineeProjectDetail;

    expect(result).toMatchObject({
      id: 'trainee-1',
      projectType: 'Trainee Project',
      originalGrant: 'Trainee Original Grant',
      originalGrantProposalId: 'trainee-proposal-1',
      supplementGrant: {
        grantTitle: 'Trainee Supplement',
        grantDescription: 'Trainee supplement description',
        grantProposalId: 'trainee-proposal-2',
        grantStartDate: '2024-06-01',
        grantEndDate: '2025-06-01',
      },
    });

    // Verify members are included and ordered correctly: trainees first, then mentors
    expect(result.members).toBeDefined();
    expect(result.members).toHaveLength(2);
    // Trainee (Trainee Project - Lead) should come first
    expect(result.members[0]).toMatchObject({
      id: 'user-trainee',
      role: 'Trainee Project - Lead',
    });
    // Mentor should come after
    expect(result.members[1]).toMatchObject({
      id: 'user-trainer',
      role: 'Trainee Project - Mentor',
    });
  });

  it('parses Trainee Project detail with Key Personnel role', () => {
    const traineeItem = getTraineeProjectDetailGraphqlItem({
      originalGrant: 'Trainee Original Grant',
      proposalId: 'trainee-proposal-1',
    });

    // Override members to include Key Personnel
    traineeItem.membersCollection = {
      total: 2,
      items: [
        {
          sys: { id: 'membership-trainee-trainee' },
          role: 'Trainee Project - Lead',
          projectMember: {
            __typename: 'Users',
            sys: { id: 'user-trainee' },
            firstName: 'Dana',
            nickname: '',
            lastName: 'Lopez',
            email: 'dana@example.com',
            onboarded: true,
            avatar: { url: null },
            alumniSinceDate: undefined,
          },
        },
        {
          sys: { id: 'membership-trainee-key-personnel' },
          role: 'Trainee Project - Key Personnel',
          projectMember: {
            __typename: 'Users',
            sys: { id: 'user-key-personnel' },
            firstName: 'Key',
            nickname: '',
            lastName: 'Personnel',
            email: 'key@example.com',
            onboarded: true,
            avatar: { url: null },
            alumniSinceDate: undefined,
          },
        },
      ],
    };

    const result = parseContentfulProjectDetail(
      traineeItem,
    ) as TraineeProjectDetail;

    expect(result.members).toHaveLength(2);
    expect(result.members[0]).toMatchObject({
      id: 'user-trainee',
      role: 'Trainee Project - Lead',
    });
    expect(result.members[1]).toMatchObject({
      id: 'user-key-personnel',
      role: 'Trainee Project - Key Personnel',
    });
  });

  it('parses Discovery Project detail fallback when no team member exists', () => {
    const discoveryItemWithoutTeam = {
      ...getDiscoveryProjectWithoutTeamGraphqlItem(),
      ...getOriginalGrantFields({
        originalGrant: 'Original Grant Without Team',
        proposalId: 'proposal-no-team',
      }),
      supplementGrant: getSupplementGrantFields({
        id: 'supplement-no-team',
        title: 'Supplement Grant Without Team',
        description: 'Supplement grant description',
        proposalId: 'supplement-proposal-no-team',
      }),
    };

    const result = parseContentfulProjectDetail(discoveryItemWithoutTeam);

    expect(result).toMatchObject({
      id: 'discovery-no-team',
      projectType: 'Discovery Project',
      originalGrant: 'Original Grant Without Team',
      originalGrantProposalId: 'proposal-no-team',
      supplementGrant: {
        grantTitle: 'Supplement Grant Without Team',
        grantDescription: 'Supplement grant description',
        grantProposalId: 'supplement-proposal-no-team',
      },
      // Should not have fundedTeam or collaborators when no team exists
      researchTheme: '',
      teamName: '',
    });
    expect(result).not.toHaveProperty('fundedTeam');
    expect(result).not.toHaveProperty('collaborators');
  });

  it('throws when parseContentfulProjectDetail encounters an unknown project type', () => {
    const invalidItem = {
      ...getDiscoveryProjectDetailGraphqlItem({
        originalGrant: 'Test Grant',
        proposalId: null,
        supplementGrant: null,
        teamDescription: null,
      }),
      projectType: 'Unknown Project Type', // Invalid type
    };

    expect(() => parseContentfulProjectDetail(invalidItem as never)).toThrow(
      'Unknown project type: Unknown Project Type',
    );
  });

  describe('parseContentfulProjectDetail - manuscripts', () => {
    it('returns manuscripts and collaborationManuscripts for a Discovery project', () => {
      const graphqlItem = getDiscoveryProjectDetailGraphqlItem();
      const teamMember = (graphqlItem as Record<string, unknown>)
        .membersCollection as {
        items: Array<{
          projectMember: Record<string, unknown>;
        }>;
      };
      const team = teamMember.items.find(
        (m) =>
          (m.projectMember as { __typename?: string }).__typename === 'Teams',
      );
      team!.projectMember.linkedFrom = {
        manuscriptsCollection: {
          items: [
            {
              sys: { id: 'manuscript-1' },
              status: 'Review Compliance Report',
              teamsCollection: {
                items: [{ sys: { id: 'team-1' } }],
              },
            },
            {
              sys: { id: 'manuscript-2' },
              status: 'Waiting for Report',
              teamsCollection: {
                items: [{ sys: { id: 'other-team' } }],
              },
            },
          ],
        },
      };

      const result = parseContentfulProjectDetail(graphqlItem);

      expect(result).toMatchObject({
        manuscripts: ['manuscript-1'],
        collaborationManuscripts: ['manuscript-2'],
      });
    });

    it('sorts manuscripts with Compliant and Closed (other) last', () => {
      const graphqlItem = getDiscoveryProjectDetailGraphqlItem();
      const teamMember = (graphqlItem as Record<string, unknown>)
        .membersCollection as {
        items: Array<{
          projectMember: Record<string, unknown>;
        }>;
      };
      const team = teamMember.items.find(
        (m) =>
          (m.projectMember as { __typename?: string }).__typename === 'Teams',
      );
      team!.projectMember.linkedFrom = {
        manuscriptsCollection: {
          items: [
            {
              sys: { id: 'compliant-ms' },
              status: 'Compliant',
              teamsCollection: { items: [{ sys: { id: 'team-1' } }] },
            },
            {
              sys: { id: 'active-ms' },
              status: 'Review Compliance Report',
              teamsCollection: { items: [{ sys: { id: 'team-1' } }] },
            },
            {
              sys: { id: 'closed-ms' },
              status: 'Closed (other)',
              teamsCollection: { items: [{ sys: { id: 'team-1' } }] },
            },
          ],
        },
      };

      const result = parseContentfulProjectDetail(graphqlItem);

      expect(result).toMatchObject({
        manuscripts: ['active-ms', 'compliant-ms', 'closed-ms'],
      });
    });

    it('returns empty manuscripts when team has no linkedFrom', () => {
      const graphqlItem = getDiscoveryProjectDetailGraphqlItem();
      const result = parseContentfulProjectDetail(graphqlItem);

      expect(result).toMatchObject({
        manuscripts: [],
        collaborationManuscripts: [],
      });
    });

    it('returns manuscripts for a Resource team-based project', () => {
      const graphqlItem = getResourceTeamProjectDetailGraphqlItem();
      const teamMember = (graphqlItem as Record<string, unknown>)
        .membersCollection as {
        items: Array<{
          projectMember: Record<string, unknown>;
        }>;
      };
      const team = teamMember.items.find(
        (m) =>
          (m.projectMember as { __typename?: string }).__typename === 'Teams',
      );
      team!.projectMember.linkedFrom = {
        manuscriptsCollection: {
          items: [
            {
              sys: { id: 'resource-ms-1' },
              status: 'Waiting for Report',
              teamsCollection: {
                items: [{ sys: { id: 'resource-team-main' } }],
              },
            },
          ],
        },
      };

      const result = parseContentfulProjectDetail(graphqlItem);

      expect(result).toMatchObject({
        manuscripts: ['resource-ms-1'],
        collaborationManuscripts: [],
      });
    });

    it('does not include manuscripts for Resource non-team-based projects', () => {
      const graphqlItem = getResourceIndividualProjectDetailGraphqlItem();
      const result = parseContentfulProjectDetail(graphqlItem);

      expect(result).not.toHaveProperty('manuscripts');
      expect(result).not.toHaveProperty('collaborationManuscripts');
    });

    it('does not include manuscripts for Trainee projects', () => {
      const graphqlItem = getTraineeProjectDetailGraphqlItem();
      const result = parseContentfulProjectDetail(graphqlItem);

      expect(result).not.toHaveProperty('manuscripts');
      expect(result).not.toHaveProperty('collaborationManuscripts');
    });

    it('filters out null manuscript items', () => {
      const graphqlItem = getDiscoveryProjectDetailGraphqlItem();
      const teamMember = (graphqlItem as Record<string, unknown>)
        .membersCollection as {
        items: Array<{
          projectMember: Record<string, unknown>;
        }>;
      };
      const team = teamMember.items.find(
        (m) =>
          (m.projectMember as { __typename?: string }).__typename === 'Teams',
      );
      team!.projectMember.linkedFrom = {
        manuscriptsCollection: {
          items: [
            null,
            {
              sys: { id: 'valid-ms' },
              status: 'Waiting for Report',
              teamsCollection: { items: [{ sys: { id: 'team-1' } }] },
            },
            null,
          ],
        },
      };

      const result = parseContentfulProjectDetail(graphqlItem);

      expect(result).toMatchObject({
        manuscripts: ['valid-ms'],
        collaborationManuscripts: [],
      });
    });
  });

  describe('ProjectContentfulDataProvider - fetch with projectMembershipId filter', () => {
    const contentfulClientMock = getContentfulGraphqlClientMock();
    const dataProvider = new ProjectContentfulDataProvider(
      contentfulClientMock,
    );

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('fetches projects by membership ID when projectMembershipId filter is provided', async () => {
      contentfulClientMock.request.mockResolvedValueOnce({
        projectMembership: {
          sys: { id: 'membership-1' },
          linkedFrom: {
            projectsCollection: {
              total: 2,
              items: [
                getDiscoveryProjectGraphqlItem(),
                getResourceTeamProjectGraphqlItem(),
              ],
            },
          },
        },
      });

      const result = await dataProvider.fetch({
        filter: { projectMembershipId: 'membership-1' },
        take: 10,
        skip: 0,
      });

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
      expect(contentfulClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          membershipId: 'membership-1',
          limit: 20,
        },
      );
    });

    it('returns empty list when project membership does not exist', async () => {
      contentfulClientMock.request.mockResolvedValueOnce({
        projectMembership: null,
      });

      const result = await dataProvider.fetch({
        filter: { projectMembershipId: 'non-existent' },
      });

      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });

    it('returns empty list when project membership has no linked projects', async () => {
      contentfulClientMock.request.mockResolvedValueOnce({
        projectMembership: {
          sys: { id: 'membership-1' },
          linkedFrom: {
            projectsCollection: null,
          },
        },
      });

      const result = await dataProvider.fetch({
        filter: { projectMembershipId: 'membership-1' },
      });

      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });

    it('filters out null projects from the results', async () => {
      contentfulClientMock.request.mockResolvedValueOnce({
        projectMembership: {
          sys: { id: 'membership-1' },
          linkedFrom: {
            projectsCollection: {
              total: 3,
              items: [
                getDiscoveryProjectGraphqlItem(),
                null,
                getResourceTeamProjectGraphqlItem(),
              ],
            },
          },
        },
      });

      const result = await dataProvider.fetch({
        filter: { projectMembershipId: 'membership-1' },
      });

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
    });

    it('applies pagination correctly to filtered results', async () => {
      const projects = [
        getDiscoveryProjectGraphqlItem(),
        getResourceTeamProjectGraphqlItem(),
        getResourceIndividualProjectGraphqlItem(),
        getTraineeProjectGraphqlItem(),
      ];

      contentfulClientMock.request.mockResolvedValueOnce({
        projectMembership: {
          sys: { id: 'membership-1' },
          linkedFrom: {
            projectsCollection: {
              total: 4,
              items: projects,
            },
          },
        },
      });

      const result = await dataProvider.fetch({
        filter: { projectMembershipId: 'membership-1' },
        take: 2,
        skip: 1,
      });

      expect(result.total).toBe(4);
      expect(result.items).toHaveLength(2);
      // Should return items at index 1 and 2
      expect(result.items[0]).toMatchObject({
        id: projects[1]?.sys.id,
      });
      expect(result.items[1]).toMatchObject({
        id: projects[2]?.sys.id,
      });
    });
  });

  describe('ProjectContentfulDataProvider - fetchByTeamId', () => {
    const contentfulClientMock = getContentfulGraphqlClientMock();
    const dataProvider = new ProjectContentfulDataProvider(
      contentfulClientMock,
    );

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('fetches projects for a given team ID', async () => {
      contentfulClientMock.request.mockResolvedValueOnce({
        teams: {
          linkedFrom: {
            projectMembershipCollection: {
              items: [
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [getDiscoveryProjectGraphqlItem()],
                    },
                  },
                },
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [getResourceTeamProjectGraphqlItem()],
                    },
                  },
                },
              ],
            },
          },
        },
      });

      const result = await dataProvider.fetchByTeamId('team-1', {
        take: 10,
        skip: 0,
      });

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
      expect(contentfulClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          teamId: 'team-1',
          limit: 100,
        },
      );
    });

    it('returns empty list when team does not exist', async () => {
      contentfulClientMock.request.mockResolvedValueOnce({
        teams: null,
      });

      const result = await dataProvider.fetchByTeamId('non-existent', {
        take: 10,
        skip: 0,
      });

      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });

    it('returns empty list when team has no project memberships', async () => {
      contentfulClientMock.request.mockResolvedValueOnce({
        teams: {
          linkedFrom: {
            projectMembershipCollection: null,
          },
        },
      });

      const result = await dataProvider.fetchByTeamId('team-1', {
        take: 10,
        skip: 0,
      });

      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });

    it('deduplicates projects when team has multiple memberships to same project', async () => {
      const discoveryProject = getDiscoveryProjectGraphqlItem();

      contentfulClientMock.request.mockResolvedValueOnce({
        teams: {
          linkedFrom: {
            projectMembershipCollection: {
              items: [
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [discoveryProject],
                    },
                  },
                },
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [discoveryProject], // Same project again
                    },
                  },
                },
              ],
            },
          },
        },
      });

      const result = await dataProvider.fetchByTeamId('team-1', {
        take: 10,
        skip: 0,
      });

      expect(result.total).toBe(1); // Should be deduplicated
      expect(result.items).toHaveLength(1);
    });

    it('filters out null memberships', async () => {
      contentfulClientMock.request.mockResolvedValueOnce({
        teams: {
          linkedFrom: {
            projectMembershipCollection: {
              items: [
                null,
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [getDiscoveryProjectGraphqlItem()],
                    },
                  },
                },
                null,
              ],
            },
          },
        },
      });

      const result = await dataProvider.fetchByTeamId('team-1', {
        take: 10,
        skip: 0,
      });

      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
    });

    it('applies pagination correctly after deduplication', async () => {
      contentfulClientMock.request.mockResolvedValueOnce({
        teams: {
          linkedFrom: {
            projectMembershipCollection: {
              items: [
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [getDiscoveryProjectGraphqlItem()],
                    },
                  },
                },
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [getResourceTeamProjectGraphqlItem()],
                    },
                  },
                },
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [getResourceIndividualProjectGraphqlItem()],
                    },
                  },
                },
              ],
            },
          },
        },
      });

      const result = await dataProvider.fetchByTeamId('team-1', {
        take: 1,
        skip: 1,
      });

      expect(result.total).toBe(3);
      expect(result.items).toHaveLength(1);
    });
  });

  describe('ProjectContentfulDataProvider - fetchByUserId', () => {
    const contentfulClientMock = getContentfulGraphqlClientMock();
    const dataProvider = new ProjectContentfulDataProvider(
      contentfulClientMock,
    );

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('fetches projects for a given user ID', async () => {
      contentfulClientMock.request.mockResolvedValueOnce({
        users: {
          linkedFrom: {
            projectMembershipCollection: {
              items: [
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [getDiscoveryProjectGraphqlItem()],
                    },
                  },
                },
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [getResourceTeamProjectGraphqlItem()],
                    },
                  },
                },
              ],
            },
          },
        },
      });

      const result = await dataProvider.fetchByUserId('user-1', {
        take: 10,
        skip: 0,
      });

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
      expect(contentfulClientMock.request).toHaveBeenCalledWith(
        expect.anything(),
        {
          userId: 'user-1',
          limit: 100,
        },
      );
    });

    it('returns empty list when user does not exist', async () => {
      contentfulClientMock.request.mockResolvedValueOnce({
        users: null,
      });

      const result = await dataProvider.fetchByUserId('non-existent', {
        take: 10,
        skip: 0,
      });

      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });

    it('returns empty list when user has no project memberships', async () => {
      contentfulClientMock.request.mockResolvedValueOnce({
        users: {
          linkedFrom: {
            projectMembershipCollection: null,
          },
        },
      });

      const result = await dataProvider.fetchByUserId('user-1', {
        take: 10,
        skip: 0,
      });

      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });

    it('deduplicates projects when user has multiple memberships to same project', async () => {
      const discoveryProject = getDiscoveryProjectGraphqlItem();

      contentfulClientMock.request.mockResolvedValueOnce({
        users: {
          linkedFrom: {
            projectMembershipCollection: {
              items: [
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [discoveryProject],
                    },
                  },
                },
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [discoveryProject], // Same project again
                    },
                  },
                },
              ],
            },
          },
        },
      });

      const result = await dataProvider.fetchByUserId('user-1', {
        take: 10,
        skip: 0,
      });

      expect(result.total).toBe(1); // Should be deduplicated
      expect(result.items).toHaveLength(1);
    });

    it('filters out null memberships', async () => {
      contentfulClientMock.request.mockResolvedValueOnce({
        users: {
          linkedFrom: {
            projectMembershipCollection: {
              items: [
                null,
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [getDiscoveryProjectGraphqlItem()],
                    },
                  },
                },
                null,
              ],
            },
          },
        },
      });

      const result = await dataProvider.fetchByUserId('user-1', {
        take: 10,
        skip: 0,
      });

      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
    });

    it('applies pagination correctly after deduplication', async () => {
      contentfulClientMock.request.mockResolvedValueOnce({
        users: {
          linkedFrom: {
            projectMembershipCollection: {
              items: [
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [getDiscoveryProjectGraphqlItem()],
                    },
                  },
                },
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [getResourceTeamProjectGraphqlItem()],
                    },
                  },
                },
                {
                  linkedFrom: {
                    projectsCollection: {
                      items: [getResourceIndividualProjectGraphqlItem()],
                    },
                  },
                },
              ],
            },
          },
        },
      });

      const result = await dataProvider.fetchByUserId('user-1', {
        take: 1,
        skip: 1,
      });

      expect(result.total).toBe(3);
      expect(result.items).toHaveLength(1);
    });
  });
});

describe('parseMilestonesFromAims', () => {
  it('returns undefined for undefined input', () => {
    expect(parseMilestonesFromAims(undefined)).toBeUndefined();
  });

  it('returns undefined for an empty array', () => {
    expect(parseMilestonesFromAims([])).toBeUndefined();
  });

  it('returns undefined when all aims are null', () => {
    expect(parseMilestonesFromAims([null, null])).toBeUndefined();
  });

  it('returns undefined when aims have no milestones', () => {
    const result = parseMilestonesFromAims([
      {
        sys: { id: 'aim-1' },
        description: 'Aim without milestones',
        milestonesCollection: { items: [] },
      },
    ]);

    expect(result).toBeUndefined();
  });

  it('returns undefined when milestonesCollection is missing', () => {
    const result = parseMilestonesFromAims([
      {
        sys: { id: 'aim-1' },
        description: 'Aim without milestonesCollection',
      },
    ]);

    expect(result).toBeUndefined();
  });

  it('parses milestones from aims correctly', () => {
    const result = parseMilestonesFromAims([
      {
        sys: { id: 'aim-1' },
        description: 'First aim',
        milestonesCollection: {
          items: [
            {
              sys: { id: 'ms-1' },
              description: 'Milestone One',
              status: 'Complete',
            },
            {
              sys: { id: 'ms-2' },
              description: 'Milestone Two',
              status: 'In Progress',
            },
          ],
        },
      },
    ]);

    expect(result).toEqual([
      {
        id: 'ms-1',
        description: 'Milestone One',
        status: 'Complete',
        aims: '1',
      },
      {
        id: 'ms-2',
        description: 'Milestone Two',
        status: 'In Progress',
        aims: '1',
      },
    ]);
  });

  it('deduplicates milestones across aims', () => {
    const result = parseMilestonesFromAims([
      {
        sys: { id: 'aim-1' },
        description: 'First aim',
        milestonesCollection: {
          items: [
            {
              sys: { id: 'ms-shared' },
              description: 'Shared Milestone',
              status: 'Pending',
            },
          ],
        },
      },
      {
        sys: { id: 'aim-2' },
        description: 'Second aim',
        milestonesCollection: {
          items: [
            {
              sys: { id: 'ms-shared' },
              description: 'Shared Milestone',
              status: 'Pending',
            },
          ],
        },
      },
    ]);

    // Should appear only once, not twice
    expect(result).toHaveLength(1);
    expect(result![0]!.id).toBe('ms-shared');
  });

  it('aggregates aim orders for shared milestones', () => {
    const result = parseMilestonesFromAims([
      {
        sys: { id: 'aim-1' },
        description: 'First aim',
        milestonesCollection: {
          items: [
            {
              sys: { id: 'ms-shared' },
              description: 'Shared Milestone',
              status: 'In Progress',
            },
          ],
        },
      },
      {
        sys: { id: 'aim-2' },
        description: 'Second aim',
        milestonesCollection: {
          items: [
            {
              sys: { id: 'ms-shared' },
              description: 'Shared Milestone',
              status: 'In Progress',
            },
          ],
        },
      },
      {
        sys: { id: 'aim-3' },
        description: 'Third aim',
        milestonesCollection: {
          items: [
            {
              sys: { id: 'ms-shared' },
              description: 'Shared Milestone',
              status: 'In Progress',
            },
          ],
        },
      },
    ]);

    expect(result).toEqual([
      {
        id: 'ms-shared',
        description: 'Shared Milestone',
        status: 'In Progress',
        aims: '1,2,3',
      },
    ]);
  });

  it('handles null items in aims array', () => {
    const result = parseMilestonesFromAims([
      null,
      {
        sys: { id: 'aim-1' },
        description: 'Valid aim',
        milestonesCollection: {
          items: [
            {
              sys: { id: 'ms-1' },
              description: 'Milestone',
              status: 'Pending',
            },
          ],
        },
      },
      null,
    ]);

    expect(result).toEqual([
      {
        id: 'ms-1',
        description: 'Milestone',
        status: 'Pending',
        aims: '1',
      },
    ]);
  });

  it('filters out null milestone items within milestonesCollection', () => {
    const result = parseMilestonesFromAims([
      {
        sys: { id: 'aim-1' },
        description: 'Aim with null milestones',
        milestonesCollection: {
          items: [
            null,
            {
              sys: { id: 'ms-1' },
              description: 'Valid Milestone',
              status: 'Complete',
            },
            null,
          ],
        },
      },
    ]);

    expect(result).toEqual([
      {
        id: 'ms-1',
        description: 'Valid Milestone',
        status: 'Complete',
        aims: '1',
      },
    ]);
  });

  it('filters out milestones with empty or whitespace-only descriptions', () => {
    const result = parseMilestonesFromAims([
      {
        sys: { id: 'aim-1' },
        description: 'Aim',
        milestonesCollection: {
          items: [
            { sys: { id: 'ms-blank' }, description: '', status: 'Pending' },
            {
              sys: { id: 'ms-whitespace' },
              description: '   ',
              status: 'Pending',
            },
            {
              sys: { id: 'ms-valid' },
              description: 'Real milestone',
              status: 'Pending',
            },
          ],
        },
      },
    ]);

    expect(result).toHaveLength(1);
    expect(result![0]!.id).toBe('ms-valid');
  });

  it('defaults to Pending for invalid status values', () => {
    const result = parseMilestonesFromAims([
      {
        sys: { id: 'aim-1' },
        description: 'Aim',
        milestonesCollection: {
          items: [
            {
              sys: { id: 'ms-1' },
              description: 'Milestone with bad status',
              status: 'InvalidStatus',
            },
            {
              sys: { id: 'ms-2' },
              description: 'Milestone with null status',
              status: null,
            },
          ],
        },
      },
    ]);

    expect(result).toEqual([
      {
        id: 'ms-1',
        description: 'Milestone with bad status',
        status: 'Pending',
        aims: '1',
      },
      {
        id: 'ms-2',
        description: 'Milestone with null status',
        status: 'Pending',
        aims: '1',
      },
    ]);
  });

  it('trims whitespace from milestone descriptions', () => {
    const result = parseMilestonesFromAims([
      {
        sys: { id: 'aim-1' },
        description: 'Aim',
        milestonesCollection: {
          items: [
            {
              sys: { id: 'ms-1' },
              description: '  Padded milestone  ',
              status: 'Complete',
            },
          ],
        },
      },
    ]);

    expect(result![0]!.description).toBe('Padded milestone');
  });

  it('accepts all valid milestone statuses', () => {
    const result = parseMilestonesFromAims([
      {
        sys: { id: 'aim-1' },
        description: 'Aim',
        milestonesCollection: {
          items: [
            {
              sys: { id: 'ms-complete' },
              description: 'Complete one',
              status: 'Complete',
            },
            {
              sys: { id: 'ms-in-progress' },
              description: 'In progress one',
              status: 'In Progress',
            },
            {
              sys: { id: 'ms-pending' },
              description: 'Pending one',
              status: 'Pending',
            },
            {
              sys: { id: 'ms-terminated' },
              description: 'Terminated one',
              status: 'Terminated',
            },
          ],
        },
      },
    ]);

    expect(result).toEqual([
      expect.objectContaining({ id: 'ms-complete', status: 'Complete' }),
      expect.objectContaining({ id: 'ms-in-progress', status: 'In Progress' }),
      expect.objectContaining({ id: 'ms-pending', status: 'Pending' }),
      expect.objectContaining({ id: 'ms-terminated', status: 'Terminated' }),
    ]);
  });

  it('skips aims with empty descriptions (they are filtered out)', () => {
    const result = parseMilestonesFromAims([
      {
        sys: { id: 'aim-empty' },
        description: '',
        milestonesCollection: {
          items: [
            {
              sys: { id: 'ms-1' },
              description: 'Should not appear',
              status: 'Pending',
            },
          ],
        },
      },
      {
        sys: { id: 'aim-valid' },
        description: 'Valid aim',
        milestonesCollection: {
          items: [
            {
              sys: { id: 'ms-2' },
              description: 'Should appear',
              status: 'Complete',
            },
          ],
        },
      },
    ]);

    expect(result).toHaveLength(1);
    expect(result![0]!.id).toBe('ms-2');
    expect(result![0]!.aims).toBe('1');
  });
});

describe('ProjectContentfulDataProvider - createMilestone', () => {
  const contentfulClientMock = getContentfulGraphqlClientMock();
  const environmentMock = getContentfulEnvironmentMock();
  const contentfulRestClientMock: () => Promise<Environment> = () =>
    Promise.resolve(environmentMock);

  const dataProvider = new ProjectContentfulDataProvider(
    contentfulClientMock,
    contentfulRestClientMock,
  );

  const dataProviderWithoutRestClient = new ProjectContentfulDataProvider(
    contentfulClientMock,
  );

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('throws when REST client is not configured', async () => {
    await expect(
      dataProviderWithoutRestClient.createMilestone({
        description: 'Test milestone',
        status: 'Pending',
        aimIds: ['aim-1'],
      }),
    ).rejects.toThrow('REST client not available');
  });

  it('creates a milestone entry in Contentful and publishes it', async () => {
    const milestoneEntryMock = getEntry({});
    milestoneEntryMock.sys.id = 'new-milestone-id';
    milestoneEntryMock.publish = jest
      .fn()
      .mockResolvedValueOnce(milestoneEntryMock);
    environmentMock.createEntry.mockResolvedValueOnce(milestoneEntryMock);

    const aimEntryMock = getEntry({});
    const aimEntryUpdated = getEntry({});
    aimEntryMock.patch = jest.fn().mockResolvedValueOnce(aimEntryUpdated);
    aimEntryUpdated.publish = jest.fn().mockResolvedValueOnce(aimEntryUpdated);
    environmentMock.getEntry.mockResolvedValueOnce(aimEntryMock);

    const result = await dataProvider.createMilestone({
      description: 'Test milestone',
      status: 'In Progress',
      aimIds: ['aim-1'],
    });

    expect(result).toBe('new-milestone-id');

    expect(environmentMock.createEntry).toHaveBeenCalledWith('milestones', {
      fields: {
        description: { 'en-US': 'Test milestone' },
        status: { 'en-US': 'In Progress' },
        relatedArticles: { 'en-US': [] },
      },
    });
    expect(milestoneEntryMock.publish).toHaveBeenCalled();
  });

  it('links the milestone to each aim via patchAndPublish', async () => {
    const milestoneEntryMock = getEntry({});
    milestoneEntryMock.sys.id = 'milestone-abc';
    milestoneEntryMock.publish = jest
      .fn()
      .mockResolvedValueOnce(milestoneEntryMock);
    environmentMock.createEntry.mockResolvedValueOnce(milestoneEntryMock);

    // Two aims to link
    const aimEntry1 = getEntry({});
    const aimEntry1Updated = getEntry({});
    aimEntry1.patch = jest.fn().mockResolvedValueOnce(aimEntry1Updated);
    aimEntry1Updated.publish = jest
      .fn()
      .mockResolvedValueOnce(aimEntry1Updated);

    const aimEntry2 = getEntry({
      milestones: {
        'en-US': [
          { sys: { type: 'Link', linkType: 'Entry', id: 'existing-ms' } },
        ],
      },
    });
    const aimEntry2Updated = getEntry({});
    aimEntry2.patch = jest.fn().mockResolvedValueOnce(aimEntry2Updated);
    aimEntry2Updated.publish = jest
      .fn()
      .mockResolvedValueOnce(aimEntry2Updated);

    environmentMock.getEntry
      .mockResolvedValueOnce(aimEntry1)
      .mockResolvedValueOnce(aimEntry2);

    await dataProvider.createMilestone({
      description: 'Multi-aim milestone',
      status: 'Pending',
      aimIds: ['aim-1', 'aim-2'],
    });

    expect(environmentMock.getEntry).toHaveBeenCalledWith('aim-1');
    expect(environmentMock.getEntry).toHaveBeenCalledWith('aim-2');

    // First aim had no existing milestones
    expect(aimEntry1.patch).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          path: '/fields/milestones',
          value: {
            'en-US': [
              {
                sys: {
                  type: 'Link',
                  linkType: 'Entry',
                  id: 'milestone-abc',
                },
              },
            ],
          },
        }),
      ]),
    );

    // Second aim had an existing milestone
    expect(aimEntry2.patch).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          path: '/fields/milestones',
          value: {
            'en-US': [
              {
                sys: {
                  type: 'Link',
                  linkType: 'Entry',
                  id: 'existing-ms',
                },
              },
              {
                sys: {
                  type: 'Link',
                  linkType: 'Entry',
                  id: 'milestone-abc',
                },
              },
            ],
          },
        }),
      ]),
    );
  });

  it('includes relatedArticleIds as links when provided', async () => {
    const milestoneEntryMock = getEntry({});
    milestoneEntryMock.sys.id = 'ms-with-articles';
    milestoneEntryMock.publish = jest
      .fn()
      .mockResolvedValueOnce(milestoneEntryMock);
    environmentMock.createEntry.mockResolvedValueOnce(milestoneEntryMock);

    const aimEntryMock = getEntry({});
    const aimEntryUpdated = getEntry({});
    aimEntryMock.patch = jest.fn().mockResolvedValueOnce(aimEntryUpdated);
    aimEntryUpdated.publish = jest.fn().mockResolvedValueOnce(aimEntryUpdated);
    environmentMock.getEntry.mockResolvedValueOnce(aimEntryMock);

    await dataProvider.createMilestone({
      description: 'Milestone with articles',
      status: 'Complete',
      aimIds: ['aim-1'],
      relatedArticleIds: ['article-1', 'article-2'],
    });

    expect(environmentMock.createEntry).toHaveBeenCalledWith('milestones', {
      fields: {
        description: { 'en-US': 'Milestone with articles' },
        status: { 'en-US': 'Complete' },
        relatedArticles: {
          'en-US': [
            { sys: { type: 'Link', linkType: 'Entry', id: 'article-1' } },
            { sys: { type: 'Link', linkType: 'Entry', id: 'article-2' } },
          ],
        },
      },
    });
  });

  it('returns the milestone ID', async () => {
    const milestoneEntryMock = getEntry({});
    milestoneEntryMock.sys.id = 'returned-milestone-id';
    milestoneEntryMock.publish = jest
      .fn()
      .mockResolvedValueOnce(milestoneEntryMock);
    environmentMock.createEntry.mockResolvedValueOnce(milestoneEntryMock);

    const aimEntryMock = getEntry({});
    const aimEntryUpdated = getEntry({});
    aimEntryMock.patch = jest.fn().mockResolvedValueOnce(aimEntryUpdated);
    aimEntryUpdated.publish = jest.fn().mockResolvedValueOnce(aimEntryUpdated);
    environmentMock.getEntry.mockResolvedValueOnce(aimEntryMock);

    const id = await dataProvider.createMilestone({
      description: 'Return value test',
      status: 'Pending',
      aimIds: ['aim-1'],
    });

    expect(id).toBe('returned-milestone-id');
  });
});
