import { gp2 as gp2Model } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { UserPayload } from '../../../src/handlers/event-bus';
import { indexUserEventsHandler } from '../../../src/handlers/event/algolia-index-user-handler';
import { getListEventResponse } from '../../fixtures/event.fixtures';
import { getUserEvent } from '../../fixtures/user.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { eventControllerMock } from '../../mocks/event.controller.mock';
import { toPayload } from '../../utils/algolia';

const mapPayload = toPayload('event');

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
describe('Index Events on User event handler', () => {
  const indexHandler = indexUserEventsHandler(
    eventControllerMock,
    algoliaSearchClientMock,
  );
  beforeEach(jest.resetAllMocks);

  test('Should throw an error and do not trigger algolia when the user request fails with another error code', async () => {
    eventControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(getUserEvent('user-id', 'UsersCreated')),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    const listEventsResponse = getListEventResponse();
    eventControllerMock.fetch.mockResolvedValueOnce(listEventsResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(getUserEvent('user-id', 'UsersUpdated')),
    ).rejects.toThrow(algoliaError);
  });

  test.each(possibleEvents)(
    'Should index event when user event %s occurs',
    async (_name, event) => {
      const listEventResponse = getListEventResponse();
      eventControllerMock.fetch.mockResolvedValueOnce(listEventResponse);

      await indexHandler(event);

      expect(eventControllerMock.fetch).toHaveBeenCalledWith({
        filter: {
          userId: 'user-id',
        },
        skip: 0,
        take: 8,
      });
      expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
        listEventResponse.items.map(mapPayload),
      );
    },
  );
});
