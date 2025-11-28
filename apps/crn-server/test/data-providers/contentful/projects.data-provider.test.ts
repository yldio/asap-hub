import { ProjectsOrder } from '@asap-hub/contentful';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import {
  ProjectContentfulDataProvider,
  parseContentfulProject,
  parseContentfulProjectDetail,
  parseProjectUserMember,
  parseProjectTeamMember,
  type ProjectMembershipItem,
} from '../../../src/data-providers/contentful/project.data-provider';
import { TraineeProject, TraineeProjectDetail } from '@asap-hub/model';
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
  getDiscoveryProjectWithoutTeamGraphqlItem,
  getDiscoveryProjectGraphqlItem,
  getProjectsGraphqlResponseWithUnknownType,
  getResourceTeamProjectGraphqlItem,
  getResourceIndividualProjectGraphqlItem,
  getDiscoveryProjectDetailGraphqlItem,
  getResourceTeamProjectDetailGraphqlItem,
  getResourceIndividualProjectDetailGraphqlItem,
  getTraineeProjectDetailGraphqlItem,
  getMilestoneGraphqlItem,
  getSupplementGrantFields,
  getOriginalGrantFields,
  getMilestonesCollection,
} from '../../fixtures/projects.fixtures';

describe('ProjectContentfulDataProvider', () => {
  const contentfulClientMock = getContentfulGraphqlClientMock();
  const dataProvider = new ProjectContentfulDataProvider(contentfulClientMock);

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
    it('returns a parsed project when the entry exists', async () => {
      contentfulClientMock.request.mockResolvedValueOnce(
        getProjectByIdGraphqlResponse(),
      );

      const result = await dataProvider.fetchById('discovery-1');

      expect(result).toEqual(getExpectedDiscoveryProjectDetail());
    });

    it('returns null when Contentful does not return the project', async () => {
      contentfulClientMock.request.mockResolvedValueOnce({ projects: null });

      const result = await dataProvider.fetchById('missing');

      expect(result).toBeNull();
    });

    it('returns null when Contentful request fails', async () => {
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
            role: 'Trainee',
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
            role: 'Trainee',
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
            sys: { id: 'membership-trainer-lead' },
            role: 'Trainee Project - Lead',
            projectMember: {
              __typename: 'Users',
              sys: { id: 'user-trainer-lead' },
              firstName: 'Lead',
              nickname: '',
              lastName: 'Trainer',
              email: 'lead@example.com',
              onboarded: true,
              avatar: { url: null },
              alumniSinceDate: undefined,
            },
          },
          {
            sys: { id: 'membership-trainer-mentor' },
            role: 'Trainee Project - Mentor',
            projectMember: {
              __typename: 'Users',
              sys: { id: 'user-trainer-mentor' },
              firstName: 'Mentor',
              nickname: '',
              lastName: 'Trainer',
              email: 'mentor@example.com',
              onboarded: true,
              avatar: { url: null },
              alumniSinceDate: undefined,
            },
          },
          {
            sys: { id: 'membership-trainer-key' },
            role: 'Trainee Project - Key Personnel',
            projectMember: {
              __typename: 'Users',
              sys: { id: 'user-trainer-key' },
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

    // Members should include all: trainees first, then trainers
    expect(result.members).toHaveLength(5);

    // Check trainees are first
    expect(result.members[0]).toMatchObject({
      id: 'user-trainee-1',
      role: 'Trainee',
    });
    expect(result.members[1]).toMatchObject({
      id: 'user-trainee-2',
      role: 'Trainee',
    });

    // Check trainers follow
    expect(result.members[2]).toMatchObject({
      id: 'user-trainer-lead',
      role: 'Trainee Project - Lead',
    });
    expect(result.members[3]).toMatchObject({
      id: 'user-trainer-mentor',
      role: 'Trainee Project - Mentor',
    });
    expect(result.members[4]).toMatchObject({
      id: 'user-trainer-key',
      role: 'Trainee Project - Key Personnel',
    });
  });

  it('defaults trainee trainer to the first trainer when no trainer roles are present', () => {
    const traineeWithoutTrainer = {
      ...getTraineeProjectGraphqlItem(),
      sys: { id: 'trainee-no-trainer' },
      membersCollection: {
        total: 2,
        items: [
          {
            sys: { id: 'membership-trainee-1' },
            role: 'Trainee',
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
            role: 'Trainee',
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
      traineeWithoutTrainer,
    ) as TraineeProject;

    // Should include all members (both trainees)
    expect(result.members).toHaveLength(2);
    expect(result.members[0]).toMatchObject({
      id: 'user-primary',
      role: 'Trainee',
    });
    expect(result.members[1]).toMatchObject({
      id: 'user-secondary',
      role: 'Trainee',
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

describe('parseContentfulProjectDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('parses Discovery Project detail with milestones, originalGrant, and supplementGrant', () => {
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
      milestones: [
        getMilestoneGraphqlItem('milestone-1', {
          title: 'Milestone 1',
          description: 'First milestone',
          status: 'Completed',
          externalLink: 'https://example.com/milestone1',
        }),
        getMilestoneGraphqlItem('milestone-2', {
          title: 'Milestone 2',
          description: 'Second milestone',
          status: 'In Progress',
          externalLink: null,
        }),
        null,
      ],
      teamDescription: 'Team description for discovery',
    });

    const result = parseContentfulProjectDetail(discoveryItem);

    expect(result).toMatchObject(
      getExpectedDiscoveryProjectDetailWithAllFields(),
    );
  });

  it('parses Discovery Project detail without milestones, supplementGrant, or teamDescription', () => {
    const discoveryItem = getDiscoveryProjectDetailGraphqlItem({
      originalGrant: 'Original Grant',
      proposalId: null,
      supplementGrant: null,
      milestones: [],
      teamDescription: null,
    });

    const result = parseContentfulProjectDetail(discoveryItem);

    expect(result).toMatchObject({
      originalGrant: 'Original Grant',
      originalGrantProposalId: undefined,
      supplementGrant: undefined,
      milestones: undefined,
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
      milestones: [
        getMilestoneGraphqlItem('resource-milestone-1', {
          title: 'Resource Milestone',
          description: 'Resource milestone description',
          status: 'Not Started',
          externalLink: null,
        }),
      ],
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
      milestones: [
        {
          id: 'resource-milestone-1',
          title: 'Resource Milestone',
          description: 'Resource milestone description',
          status: 'Not Started',
        },
      ],
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
      milestones: [],
    });

    const result = parseContentfulProjectDetail(resourceItem);

    expect(result).toMatchObject({
      id: 'resource-individual-1',
      projectType: 'Resource Project',
      originalGrant: 'Individual Resource Grant',
      originalGrantProposalId: 'individual-proposal-1',
      supplementGrant: undefined,
      milestones: undefined,
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

  it('parses Trainee Project detail with milestones and grants', () => {
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
      milestones: [
        getMilestoneGraphqlItem('trainee-milestone-1', {
          title: 'Trainee Milestone',
          description: 'Trainee milestone description',
          status: 'Completed',
          externalLink: 'https://example.com/trainee',
        }),
      ],
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
      milestones: [
        {
          id: 'trainee-milestone-1',
          title: 'Trainee Milestone',
          description: 'Trainee milestone description',
          status: 'Completed',
          link: 'https://example.com/trainee',
        },
      ],
    });

    // Verify members are included and ordered correctly: trainees first, then trainers
    expect(result.members).toBeDefined();
    expect(result.members).toHaveLength(2);
    // Trainee should come first
    expect(result.members[0]).toMatchObject({
      id: 'user-trainee',
      role: 'Trainee',
    });
    // Trainer should come after
    expect(result.members[1]).toMatchObject({
      id: 'user-trainer',
      role: 'Trainee Project - Mentor',
    });
  });

  it('handles empty milestones collection', () => {
    const discoveryItem = getDiscoveryProjectDetailGraphqlItem({
      originalGrant: 'Grant',
      proposalId: null,
      supplementGrant: null,
      milestones: [],
      teamDescription: null,
    });

    const result = parseContentfulProjectDetail(discoveryItem);

    expect(result.milestones).toBeUndefined();
  });

  it('handles null milestones collection', () => {
    const discoveryItem = {
      ...getDiscoveryProjectDetailGraphqlItem({
        originalGrant: 'Grant',
        proposalId: null,
        supplementGrant: null,
        milestones: [],
        teamDescription: null,
      }),
      milestonesCollection: null,
    };

    const result = parseContentfulProjectDetail(discoveryItem);

    expect(result.milestones).toBeUndefined();
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
      milestonesCollection: getMilestonesCollection([
        getMilestoneGraphqlItem('milestone-no-team', {
          title: 'Milestone Without Team',
          status: 'Completed',
        }),
      ]),
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
      milestones: [
        {
          id: 'milestone-no-team',
          title: 'Milestone Without Team',
          status: 'Completed',
        },
      ],
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
        milestones: [],
        teamDescription: null,
      }),
      projectType: 'Unknown Project Type', // Invalid type
    };

    expect(() => parseContentfulProjectDetail(invalidItem as never)).toThrow(
      'Unknown project type: Unknown Project Type',
    );
  });
});
