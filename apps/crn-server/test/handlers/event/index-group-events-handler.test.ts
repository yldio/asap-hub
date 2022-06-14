import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { toPayload } from '../../helpers/algolia';
import { getGroupEvent } from '../../fixtures/groups.fixtures';
import { algoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { eventControllerMock } from '../../mocks/event-controller.mock';
import { indexGroupEventsHandler } from '../../../src/handlers/event/index-group-events-handler';
import { listEventResponse } from '../../fixtures/events.fixtures';
import { GroupEvent, GroupPayload } from '../../../src/handlers/event-bus';

const mapPayload = toPayload('event');

const possibleEvents: [string, EventBridgeEvent<GroupEvent, GroupPayload>][] = [
  ['created', getGroupEvent('group-id', 'GroupsCreated')],
  ['updated', getGroupEvent('group-id', 'GroupsUpdated')],
  ['unpublished', getGroupEvent('group-id', 'GroupsUnpublished')],
  ['deleted', getGroupEvent('group-id', 'GroupsDeleted')],
];

describe('Index Events on Group event handler', () => {
  const indexHandler = indexGroupEventsHandler(
    eventControllerMock,
    algoliaSearchClientMock,
  );
  afterEach(() => jest.clearAllMocks());

  test('Should throw an error and do not trigger algolia when the group request fails with another error code', async () => {
    eventControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(getGroupEvent('group-id', 'GroupsCreated')),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    eventControllerMock.fetch.mockResolvedValueOnce(listEventResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(getGroupEvent('group-id', 'GroupsUpdated')),
    ).rejects.toThrow(algoliaError);
  });

  test.each(possibleEvents)(
    'Should index event when group event %s occurs',
    async (name, event) => {
      eventControllerMock.fetch.mockResolvedValueOnce(listEventResponse);

      await indexHandler(event);

      expect(eventControllerMock.fetch).toHaveBeenCalledWith({
        filter: {
          groupId: 'group-id',
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
