import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { toPayload } from '../../helpers/algolia';
import { getExternalAuthorEvent } from '../../fixtures/external-authors.fixtures';
import { algoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { eventControllerMock } from '../../mocks/event-controller.mock';
import { indexExternalAuthorEventsHandler } from '../../../src/handlers/event/index-external-author-events-handler';
import { listEventResponse } from '../../fixtures/events.fixtures';
import {
  ExternalAuthorEvent,
  ExternalAuthorPayload,
} from '../../../src/handlers/event-bus';

const mapPayload = toPayload('event');

const possibleEvents: [
  string,
  EventBridgeEvent<ExternalAuthorEvent, ExternalAuthorPayload>,
][] = [
  [
    'created',
    getExternalAuthorEvent('external-author-id', 'ExternalAuthorsCreated'),
  ],
  [
    'updated',
    getExternalAuthorEvent('external-author-id', 'ExternalAuthorsUpdated'),
  ],
  [
    'unpublished',
    getExternalAuthorEvent('external-author-id', 'ExternalAuthorsUnpublished'),
  ],
  [
    'deleted',
    getExternalAuthorEvent('external-author-id', 'ExternalAuthorsDeleted'),
  ],
];

describe('Index Events on External Author event handler', () => {
  const indexHandler = indexExternalAuthorEventsHandler(
    eventControllerMock,
    algoliaSearchClientMock,
  );
  afterEach(() => jest.clearAllMocks());

  test('Should throw an error and do not trigger algolia when the External Author request fails with another error code', async () => {
    eventControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(
        getExternalAuthorEvent('external-author-id', 'ExternalAuthorsCreated'),
      ),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    eventControllerMock.fetch.mockResolvedValueOnce(listEventResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(
        getExternalAuthorEvent('external-author-id', 'ExternalAuthorsUpdated'),
      ),
    ).rejects.toThrow(algoliaError);
  });

  test.each(possibleEvents)(
    'Should index event when External Author event %s occurs',
    async (name, event) => {
      eventControllerMock.fetch.mockResolvedValueOnce(listEventResponse);

      await indexHandler(event);

      expect(eventControllerMock.fetch).toHaveBeenCalledWith({
        filter: {
          externalAuthorId: 'external-author-id',
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
