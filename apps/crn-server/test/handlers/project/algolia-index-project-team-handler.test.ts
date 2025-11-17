import { indexTeamByProjectHandler } from '../../../src/handlers/project/algolia-index-project-team-handler';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { teamControllerMock } from '../../mocks/team.controller.mock';
import { createAlgoliaResponse } from '@asap-hub/algolia/src/fixtures';
import { createTeamListItemResponse } from '@asap-hub/fixtures';
import { getProjectEvent } from '../../fixtures/projects.fixtures';

jest.mock('../../../src/utils/logger');

describe('Index Team by Project Handler', () => {
  afterEach(() => jest.clearAllMocks());

  const projectId = 'project-1';
  const previousTeamId = 'previous-team-id';
  const currentTeamId = 'current-team-id';

  const previousTeamResponse = createTeamListItemResponse();
  const currentTeamResponse = createTeamListItemResponse();
  previousTeamResponse.id = previousTeamId;
  currentTeamResponse.id = currentTeamId;

  const _tags = createTeamListItemResponse().tags.map((tag) => tag.name);

  const algoliaSearchClientMock = getAlgoliaSearchClientMock();
  const handler = indexTeamByProjectHandler(
    teamControllerMock,
    algoliaSearchClientMock,
  );

  const algoliaPreviousTeamResponse = createAlgoliaResponse<'crn', 'team'>([
    {
      ...previousTeamResponse,
      objectID: previousTeamId,
      __meta: { type: 'team' },
    },
  ]);

  test('should sync previously linked and newly linked team when project is published', async () => {
    const event = publishedEvent(projectId);

    algoliaSearchClientMock.search.mockResolvedValueOnce(
      algoliaPreviousTeamResponse,
    );
    teamControllerMock.fetchTeamIdByProjectId.mockResolvedValueOnce(
      currentTeamId,
    );

    const fetchedTeams = [
      { ...currentTeamResponse },
      { ...previousTeamResponse },
    ];

    teamControllerMock.fetch.mockResolvedValueOnce({
      total: fetchedTeams.length,
      items: fetchedTeams,
    });

    await handler(event);

    expect(algoliaSearchClientMock.search).toHaveBeenCalledWith(
      ['team'],
      projectId,
      expect.objectContaining({
        page: 0,
        hitsPerPage: 1,
        restrictSearchableAttributes: ['linkedProjectId'],
      }),
    );

    expect(teamControllerMock.fetch).toHaveBeenCalledWith(
      expect.objectContaining({
        teamIds: expect.arrayContaining([previousTeamId, currentTeamId]),
      }),
    );

    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
      fetchedTeams.map((team) => ({
        data: { ...team, _tags },
        type: 'team',
      })),
    );
  });

  test('should only sync previous team if project is unpublished', async () => {
    const event = unpublishedEvent(projectId);

    algoliaSearchClientMock.search.mockResolvedValueOnce(
      algoliaPreviousTeamResponse,
    );

    teamControllerMock.fetch.mockResolvedValueOnce({
      total: 1,
      items: [{ ...previousTeamResponse }],
    });

    await handler(event);

    expect(teamControllerMock.fetchTeamIdByProjectId).not.toHaveBeenCalled();

    expect(teamControllerMock.fetch).toHaveBeenCalledWith(
      expect.objectContaining({
        teamIds: [previousTeamId],
      }),
    );

    // expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
    //     {
    //         data: {...previousTeamResponse, _tags},
    //         type: 'team',
    //     });
  });

  test('should do nothing if no previous or new teams', async () => {
    const event = publishedEvent(projectId);

    algoliaSearchClientMock.search.mockResolvedValueOnce(
      createAlgoliaResponse<'crn', 'team'>([]),
    );

    teamControllerMock.fetchTeamIdByProjectId.mockResolvedValueOnce(null);

    await handler(event);

    expect(teamControllerMock.fetch).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('should log and rethrow errors', async () => {
    const event = publishedEvent(projectId);
    const error = new Error('Algolia failed');

    algoliaSearchClientMock.search.mockRejectedValueOnce(error);

    await expect(handler(event)).rejects.toThrow('Algolia failed');
  });
});

const unpublishedEvent = (id: string) =>
  getProjectEvent(id, 'ProjectsUnpublished');

const publishedEvent = (id: string = 'user-1234') =>
  getProjectEvent(id, 'ProjectsPublished');
