import { gp2 as gp2Model } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { ProjectPayload } from '../../../src/handlers/event-bus';
import { indexUserProjectHandler } from '../../../src/handlers/user/algolia-index-project-handler';
import {
  getProjectEvent,
  getProjectResponse,
} from '../../fixtures/project.fixtures';
import { getListUsersResponse } from '../../fixtures/user.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { projectControllerMock } from '../../mocks/project.controller.mock';
import { userControllerMock } from '../../mocks/user.controller.mock';
import {
  createAlgoliaResponse,
  createProjectAlgoliaRecord,
  toPayload,
} from '../../utils/algolia';

const mapPayload = toPayload('user');

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
const projectId = '42';
const possibleEvents: [
  string,
  EventBridgeEvent<gp2Model.ProjectEvent, ProjectPayload>,
][] = [
  ['created', getProjectEvent(projectId, 'ProjectsCreated')],
  ['updated', getProjectEvent(projectId, 'ProjectsUpdated')],
  ['unpublished', getProjectEvent(projectId, 'ProjectsUnpublished')],
  ['deleted', getProjectEvent(projectId, 'ProjectsDeleted')],
];

jest.mock('../../../src/utils/logger');
describe('Index Projects on User event handler', () => {
  const indexHandler = indexUserProjectHandler(
    projectControllerMock,
    userControllerMock,
    algoliaSearchClientMock,
  );
  beforeEach(jest.resetAllMocks);

  test('Should throw an error and do not trigger algolia when the user request fails with another error code', async () => {
    projectControllerMock.fetchById.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(getProjectEvent(projectId, 'ProjectsCreated')),
    ).rejects.toThrow(Boom.badData());
    expect(userControllerMock.fetch).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.search).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    const projectResponse = getProjectResponse();
    const userListResponse = getListUsersResponse();
    const algoliaRecord = createProjectAlgoliaRecord(projectResponse);
    const algoliaResponse = createAlgoliaResponse<'project'>([algoliaRecord]);
    projectControllerMock.fetchById.mockResolvedValueOnce(projectResponse);
    algoliaSearchClientMock.search.mockResolvedValueOnce(algoliaResponse);
    userControllerMock.fetch.mockResolvedValueOnce(userListResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(getProjectEvent(projectId, 'ProjectsUpdated')),
    ).rejects.toThrow(algoliaError);
  });
  test('Should throw the algolia error when searching the record fails', async () => {
    const algoliaError = new Error('ERROR');

    const projectResponse = getProjectResponse();
    const listUserResponse = getListUsersResponse();
    projectControllerMock.fetchById.mockResolvedValueOnce(projectResponse);
    algoliaSearchClientMock.search.mockRejectedValueOnce(algoliaError);
    userControllerMock.fetch.mockResolvedValueOnce(listUserResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(getProjectEvent(projectId, 'ProjectsUpdated')),
    ).rejects.toThrow(algoliaError);
    expect(userControllerMock.fetch).not.toHaveBeenCalled();
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });
  test('Should throw the an error when fetching the user record fails', async () => {
    const projectResponse = getProjectResponse();
    const algoliaRecord = createProjectAlgoliaRecord(projectResponse);
    const algoliaResponse = createAlgoliaResponse<'project'>([algoliaRecord]);
    projectControllerMock.fetchById.mockResolvedValueOnce(projectResponse);
    algoliaSearchClientMock.search.mockResolvedValueOnce(algoliaResponse);
    userControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(getProjectEvent(projectId, 'ProjectsUpdated')),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test.each(possibleEvents)(
    'Should index event when user event %s occurs',
    async (_name, event) => {
      const userId = '11';
      const projectResponse = getProjectResponse();
      const listUserResponse = getListUsersResponse({ id: userId });
      const algoliaRecord = createProjectAlgoliaRecord(projectResponse);
      const algoliaResponse = createAlgoliaResponse<'project'>([algoliaRecord]);
      projectControllerMock.fetchById.mockResolvedValueOnce(projectResponse);
      algoliaSearchClientMock.search.mockResolvedValueOnce(algoliaResponse);
      userControllerMock.fetch.mockResolvedValueOnce(listUserResponse);
      await indexHandler(event);

      expect(projectControllerMock.fetchById).toHaveBeenCalledWith(projectId);
      expect(algoliaSearchClientMock.search).toHaveBeenCalledWith(
        ['project'],
        projectId,
      );
      expect(userControllerMock.fetch).toBeCalledWith({
        filter: {
          userIds: [userId],
        },
        take: 10,
      });
      expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
        listUserResponse.items.map(mapPayload),
      );
    },
  );
});
