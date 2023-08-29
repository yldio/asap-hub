import { gp2 as gp2Model } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { UserPayload } from '../../../src/handlers/event-bus';
import { indexUserProjectsHandler } from '../../../src/handlers/project/algolia-index-user-handler';
import { getListProjectsResponse } from '../../fixtures/project.fixtures';
import { getUserEvent } from '../../fixtures/user.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { projectControllerMock } from '../../mocks/project.controller.mock';
import { toPayload } from '../../utils/algolia';

const mapPayload = toPayload('project');

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
const possibleEvents: [
  string,
  EventBridgeEvent<gp2Model.UserEvent, UserPayload>,
][] = [
  ['created', getUserEvent('user-id', 'UsersCreated')],
  ['updated', getUserEvent('user-id', 'UsersUpdated')],
  ['unpublished', getUserEvent('user-id', 'UsersUnpublished')],
  ['deleted', getUserEvent('user-id', 'UsersDeleted')],
];

jest.mock('../../../src/utils/logger');
describe('Index Projects on User event handler', () => {
  const indexHandler = indexUserProjectsHandler(
    projectControllerMock,
    algoliaSearchClientMock,
  );
  beforeEach(jest.resetAllMocks);

  test('Should throw an error and do not trigger algolia when the user request fails with another error code', async () => {
    projectControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(getUserEvent('user-id', 'UsersCreated')),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    const listProjectsResponse = getListProjectsResponse();
    projectControllerMock.fetch.mockResolvedValueOnce(listProjectsResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(getUserEvent('user-id', 'UsersUpdated')),
    ).rejects.toThrow(algoliaError);
  });

  test.each(possibleEvents)(
    'Should index event when user event %s occurs',
    async (_name, event) => {
      const listProjectResponse = getListProjectsResponse();
      projectControllerMock.fetch.mockResolvedValueOnce(listProjectResponse);

      await indexHandler(event);

      expect(projectControllerMock.fetch).toHaveBeenCalledWith({
        filter: {
          userId: 'user-id',
        },
        skip: 0,
        take: 8,
      });
      expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
        listProjectResponse.items.map(mapPayload),
      );
    },
  );
});
