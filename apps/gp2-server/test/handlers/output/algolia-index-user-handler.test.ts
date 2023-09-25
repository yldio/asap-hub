import { gp2 as gp2Model } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { UserPayload } from '../../../src/handlers/event-bus';
import { indexOutputUserHandler } from '../../../src/handlers/output/algolia-index-user-handler';
import { getListOutputResponse } from '../../fixtures/output.fixtures';
import { getUserEvent } from '../../fixtures/user.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { outputControllerMock } from '../../mocks/output.controller.mock';
import { toPayload } from '../../utils/algolia';

const mapPayload = toPayload('output');

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
describe('Index Outputs on User event handler', () => {
  const indexHandler = indexOutputUserHandler(
    outputControllerMock,
    algoliaSearchClientMock,
  );
  beforeEach(jest.resetAllMocks);

  test('Should throw an error and do not trigger algolia when the user request fails with another error code', async () => {
    outputControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(getUserEvent('user-id', 'UsersCreated')),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    const listOutputsResponse = getListOutputResponse();
    outputControllerMock.fetch.mockResolvedValueOnce(listOutputsResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(getUserEvent('user-id', 'UsersUpdated')),
    ).rejects.toThrow(algoliaError);
  });

  test.each(possibleEvents)(
    'Should index output when user event %s occurs',
    async (_name, event) => {
      const listOutputsResponse = getListOutputResponse();
      outputControllerMock.fetch.mockResolvedValueOnce(listOutputsResponse);

      await indexHandler(event);

      expect(outputControllerMock.fetch).toHaveBeenCalledWith({
        filter: {
          authorId: 'user-id',
        },
        skip: 0,
        take: 8,
      });
      expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
        listOutputsResponse.items.map(mapPayload),
      );
    },
  );
});
