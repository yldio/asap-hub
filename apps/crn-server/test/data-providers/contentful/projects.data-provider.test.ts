import { ProjectsOrder } from '@asap-hub/contentful';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';
import {
  ProjectContentfulDataProvider,
  parseContentfulProject,
} from '../../../src/data-providers/contentful/project.data-provider';
import {
  getExpectedDiscoveryProject,
  getExpectedDiscoveryProjectWithoutTeam,
  getExpectedProjectList,
  getExpectedResourceIndividualProject,
  getExpectedResourceTeamProject,
  getExpectedTraineeProject,
  getProjectByIdGraphqlResponse,
  getProjectsGraphqlEmptyResponse,
  getProjectsGraphqlResponse,
  getDiscoveryProjectWithoutTeamGraphqlItem,
  getDiscoveryProjectGraphqlItem,
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
          status: ['Complete', 'Active'],
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
          status: 'Complete',
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

  it('throws when encountering an unknown project type', () => {
    const invalidItem = {
      ...getDiscoveryProjectGraphqlItem(),
      projectType: 'Unexpected Project',
    };

    expect(() => parseContentfulProject(invalidItem as never)).toThrow(
      'Unknown project type: Unexpected Project',
    );
  });
});
