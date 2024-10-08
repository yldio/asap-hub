import { gp2 as gp2Model } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { ExternalUserPayload } from '../../../src/handlers/event-bus';
import { indexEventExternalUserHandler } from '../../../src/handlers/event/algolia-index-external-user-handler';
import { getListEventResponse } from '../../fixtures/event.fixtures';
import { getExternalUserEvent } from '../../fixtures/external-users.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { eventControllerMock } from '../../mocks/event.controller.mock';
import { toPayload } from '../../utils/algolia';

const mapPayload = toPayload('event');

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
const possibleEvents: [
  string,
  EventBridgeEvent<gp2Model.ExternalUserEvent, ExternalUserPayload>,
][] = [
  [
    'published',
    getExternalUserEvent('external-user-id', 'ExternalUsersPublished'),
  ],
  [
    'unpublished',
    getExternalUserEvent('external-user-id', 'ExternalUsersUnpublished'),
  ],
];

jest.mock('../../../src/utils/logger');
describe('Index Events on External User event handler', () => {
  const indexHandler = indexEventExternalUserHandler(
    eventControllerMock,
    algoliaSearchClientMock,
  );
  beforeEach(jest.resetAllMocks);

  test('Should throw an error and do not trigger algolia when the user request fails with another error code', async () => {
    eventControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(
        getExternalUserEvent('external-user-id', 'ExternalUsersPublished'),
      ),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    const listEventsResponse = getListEventResponse();
    eventControllerMock.fetch.mockResolvedValueOnce(listEventsResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(
        getExternalUserEvent('external-user-id', 'ExternalUsersPublished'),
      ),
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
          externalUserId: 'external-user-id',
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
