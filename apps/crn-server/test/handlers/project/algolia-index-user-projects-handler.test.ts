import Boom from '@hapi/boom';
import { UserEvent } from '@asap-hub/model';
import { indexUserProjectsHandler } from '../../../src/handlers/project/algolia-index-user-projects-handler';
import {
  getExpectedDiscoveryProject,
  getExpectedResourceTeamProject,
} from '../../fixtures/projects.fixtures';
import { getUserEvent } from '../../fixtures/users.fixtures';
import { toPayload } from '../../helpers/algolia';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { projectControllerMock } from '../../mocks/project.controller.mock';

const mapPayload = toPayload('project');

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
const possibleEvents: [string, UserEvent][] = [
  ['published', 'UsersPublished'],
  ['unpublished', 'UsersUnpublished'],
];

jest.mock('../../../src/utils/logger');

describe('Index Projects on User event handler', () => {
  const indexHandler = indexUserProjectsHandler(
    projectControllerMock,
    algoliaSearchClientMock,
  );

  afterEach(() => jest.clearAllMocks());

  test('Should throw an error and not trigger algolia when the project request fails with another error code', async () => {
    projectControllerMock.fetchByUserId.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(getUserEvent('user-id', 'UsersPublished')),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    const listProjectResponse = {
      total: 1,
      items: [getExpectedDiscoveryProject()],
    };
    projectControllerMock.fetchByUserId.mockResolvedValueOnce(
      listProjectResponse,
    );
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(getUserEvent('user-id', 'UsersPublished')),
    ).rejects.toThrow(algoliaError);
  });

  test('Should call saveMany with empty array when no projects are found for the user', async () => {
    projectControllerMock.fetchByUserId.mockResolvedValueOnce({
      total: 0,
      items: [],
    });

    await indexHandler(getUserEvent('user-id', 'UsersPublished'));

    expect(projectControllerMock.fetchByUserId).toHaveBeenCalledWith(
      'user-id',
      {
        skip: 0,
        take: 8,
      },
    );
    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith([]);
  });

  test('Should save project with _tags', async () => {
    projectControllerMock.fetchByUserId.mockResolvedValueOnce({
      total: 1,
      items: [
        {
          ...getExpectedDiscoveryProject(),
          tags: ['Tag A', 'Tag B'],
        },
      ],
    });

    await indexHandler(getUserEvent('user-id', 'UsersPublished'));

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
    'Should index projects when user event %s occurs',
    async (_name, eventType) => {
      const listProjectResponse = {
        total: 2,
        items: [
          getExpectedDiscoveryProject(),
          getExpectedResourceTeamProject(),
        ],
      };
      projectControllerMock.fetchByUserId.mockResolvedValueOnce(
        listProjectResponse,
      );

      await indexHandler(getUserEvent('user-id', eventType));

      expect(projectControllerMock.fetchByUserId).toHaveBeenCalledWith(
        'user-id',
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

    projectControllerMock.fetchByUserId
      .mockResolvedValueOnce(firstBatch)
      .mockResolvedValueOnce(secondBatch);

    await indexHandler(getUserEvent('user-id', 'UsersPublished'));

    expect(projectControllerMock.fetchByUserId).toHaveBeenCalledTimes(2);
    expect(projectControllerMock.fetchByUserId).toHaveBeenNthCalledWith(
      1,
      'user-id',
      {
        skip: 0,
        take: 8,
      },
    );
    expect(projectControllerMock.fetchByUserId).toHaveBeenNthCalledWith(
      2,
      'user-id',
      {
        skip: 8,
        take: 8,
      },
    );
    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledTimes(2);
  });
});
