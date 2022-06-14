import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { toPayload } from '../../helpers/algolia';
import { getUserEvent } from '../../fixtures/users.fixtures';
import { algoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { eventControllerMock } from '../../mocks/event-controller.mock';
import { UserEvent, UserPayload } from '../../../src/handlers/event-bus';
import { indexUserEventsHandler } from '../../../src/handlers/event/index-user-events-handler';
import { listEventResponse } from '../../fixtures/events.fixtures';

const mapPayload = toPayload('event');

const possibleEvents: [string, EventBridgeEvent<UserEvent, UserPayload>][] = [
  ['created', getUserEvent('user-id', 'UsersCreated')],
  ['updated', getUserEvent('user-id', 'UsersUpdated')],
  ['unpublished', getUserEvent('user-id', 'UsersUnpublished')],
  ['deleted', getUserEvent('user-id', 'UsersDeleted')],
];

describe('Index Events on User event handler', () => {
  const indexHandler = indexUserEventsHandler(
    eventControllerMock,
    algoliaSearchClientMock,
  );
  afterEach(() => jest.clearAllMocks());

  test('Should throw an error and do not trigger algolia when the user request fails with another error code', async () => {
    eventControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(getUserEvent('user-id', 'UsersCreated')),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    eventControllerMock.fetch.mockResolvedValueOnce(listEventResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(getUserEvent('user-id', 'UsersUpdated')),
    ).rejects.toThrow(algoliaError);
  });

  test.each(possibleEvents)(
    'Should index event when user event %s occurs',
    async (name, event) => {
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
