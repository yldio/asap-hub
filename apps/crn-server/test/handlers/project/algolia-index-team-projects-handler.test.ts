import Boom from '@hapi/boom';
import { indexTeamProjectsHandler } from '../../../src/handlers/project/algolia-index-team-projects-handler';
import {
  getExpectedDiscoveryProject,
  getExpectedResourceTeamProject,
} from '../../fixtures/projects.fixtures';
import {
  getTeamPublishedEvent,
  getTeamUnpublishedEvent,
  TeamEventGenerator,
} from '../../fixtures/teams.fixtures';
import { toPayload } from '../../helpers/algolia';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { projectControllerMock } from '../../mocks/project.controller.mock';

const mapPayload = toPayload('project');

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
const possibleEvents: [string, TeamEventGenerator][] = [
  ['published', getTeamPublishedEvent],
  ['unpublished', getTeamUnpublishedEvent],
];

jest.mock('../../../src/utils/logger');

describe('Index Projects on Team event handler', () => {
  const indexHandler = indexTeamProjectsHandler(
    projectControllerMock,
    algoliaSearchClientMock,
  );

  afterEach(() => jest.clearAllMocks());

  test('Should throw an error and not trigger algolia when the project request fails with another error code', async () => {
    projectControllerMock.fetchByTeamId.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(getTeamPublishedEvent('team-id')),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    const listProjectResponse = {
      total: 1,
      items: [getExpectedDiscoveryProject()],
    };
    projectControllerMock.fetchByTeamId.mockResolvedValueOnce(
      listProjectResponse,
    );
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(getTeamPublishedEvent('team-id')),
    ).rejects.toThrow(algoliaError);
  });

  test('Should call saveMany with empty array when no projects are found for the team', async () => {
    projectControllerMock.fetchByTeamId.mockResolvedValueOnce({
      total: 0,
      items: [],
    });

    await indexHandler(getTeamPublishedEvent('team-id'));

    expect(projectControllerMock.fetchByTeamId).toHaveBeenCalledWith(
      'team-id',
      {
        skip: 0,
        take: 8,
      },
    );
    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith([]);
  });

  test('Should save project with _tags', async () => {
    projectControllerMock.fetchByTeamId.mockResolvedValueOnce({
      total: 1,
      items: [
        {
          ...getExpectedDiscoveryProject(),
          tags: ['Tag A', 'Tag B'],
        },
      ],
    });

    await indexHandler(getTeamPublishedEvent('team-id'));

    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith([
      {
        type: 'project',
        data: expect.objectContaining({
          _tags: ['Tag A', 'Tag B'],
        }),
      },
    ]);
  });

  test.each(possibleEvents)(
    'Should index projects when team event %s occurs',
    async (_name, event) => {
      const listProjectResponse = {
        total: 2,
        items: [
          getExpectedDiscoveryProject(),
          getExpectedResourceTeamProject(),
        ],
      };
      projectControllerMock.fetchByTeamId.mockResolvedValueOnce(
        listProjectResponse,
      );

      await indexHandler(event('team-id'));

      expect(projectControllerMock.fetchByTeamId).toHaveBeenCalledWith(
        'team-id',
        {
          skip: 0,
          take: 8,
        },
      );
      expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
        listProjectResponse.items
          .map(mapPayload)
          .map((item) => ({
            ...item,
            data: {
              ...item.data,
              _tags: (item.data as { tags?: string[] }).tags || [],
            },
          })),
      );
    },
  );

  test('Should handle pagination when there are more projects than the batch size', async () => {
    const firstBatch = {
      total: 10,
      items: Array(8).fill(getExpectedDiscoveryProject()),
    };
    const secondBatch = {
      total: 10,
      items: Array(2).fill(getExpectedResourceTeamProject()),
    };

    projectControllerMock.fetchByTeamId
      .mockResolvedValueOnce(firstBatch)
      .mockResolvedValueOnce(secondBatch);

    await indexHandler(getTeamPublishedEvent('team-id'));

    expect(projectControllerMock.fetchByTeamId).toHaveBeenCalledTimes(2);
    expect(projectControllerMock.fetchByTeamId).toHaveBeenNthCalledWith(
      1,
      'team-id',
      {
        skip: 0,
        take: 8,
      },
    );
    expect(projectControllerMock.fetchByTeamId).toHaveBeenNthCalledWith(
      2,
      'team-id',
      {
        skip: 8,
        take: 8,
      },
    );
    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledTimes(2);
  });
});
