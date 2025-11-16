import { ProjectsOrder } from '@asap-hub/contentful';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import {
  ProjectContentfulDataProvider,
  parseContentfulProject,
  parseProjectMember,
  parseProjectTeamMember,
  type ProjectMembershipItem,
} from '../../../src/data-providers/contentful/project.data-provider';
import { TraineeProject } from '@asap-hub/model';
import {
  getExpectedDiscoveryProject,
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
          projectType: ['Discovery', 'Resource'],
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
          projectType: 'Discovery',
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

      expect(result).toEqual(getExpectedDiscoveryProject());
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

  it('throws when project type is not Discovery, Resource, or Trainee', () => {
    const invalidItem = {
      ...getDiscoveryProjectGraphqlItem(),
      projectType: 'Unexpected Project',
    };

    expect(() => parseContentfulProject(invalidItem as never)).toThrow(
      'Unknown project type: Unexpected Project',
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

  it('defaults trainee trainer to the first member when no leader role is present', () => {
    const traineeWithoutLeader = {
      ...getTraineeProjectGraphqlItem(),
      sys: { id: 'trainee-no-leader' },
      membersCollection: {
        total: 2,
        items: [
          {
            sys: { id: 'membership-trainee-1' },
            role: 'Key Personnel',
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
            role: 'Participant',
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
      traineeWithoutLeader,
    ) as TraineeProject;

    expect(result.trainer).toMatchObject({ id: 'user-primary' });
    expect(result.members).toHaveLength(1);
    expect(result.members[0]).toMatchObject({ id: 'user-secondary' });
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

    expect(result.trainer.id).toBe('trainer-unknown-trainee-empty');
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

describe('parseProjectMember', () => {
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

    expect(parseProjectMember(membership)).toEqual({
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

    expect(parseProjectMember(membership)).toEqual({
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
