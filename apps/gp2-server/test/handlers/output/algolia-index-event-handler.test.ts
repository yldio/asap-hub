import { gp2 as gp2Model } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { EventPayload } from '../../../src/handlers/event-bus';
import { indexOutputEventHandler } from '../../../src/handlers/output/algolia-index-event-handler';
import { getListOutputResponse } from '../../fixtures/output.fixtures';
import { getEventEvent } from '../../fixtures/event.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { outputControllerMock } from '../../mocks/output.controller.mock';
import { toPayload } from '../../utils/algolia';

const mapPayload = toPayload('output');

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
const possibleEvents: [
  string,
  EventBridgeEvent<gp2Model.EventEvent, EventPayload>,
][] = [
  ['published', getEventEvent('event-id', 'EventsPublished')],
  ['unpublished', getEventEvent('event-id', 'EventsUnpublished')],
];

jest.mock('../../../src/utils/logger');
describe('Index Outputs on Event event handler', () => {
  const indexHandler = indexOutputEventHandler(
    outputControllerMock,
    algoliaSearchClientMock,
  );
  beforeEach(jest.resetAllMocks);

  test('Should throw an error and do not trigger algolia when the event request fails with another error code', async () => {
    outputControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(getEventEvent('event-id', 'EventsPublished')),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    const listOutputsResponse = getListOutputResponse();
    outputControllerMock.fetch.mockResolvedValueOnce(listOutputsResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(getEventEvent('event-id', 'EventsPublished')),
    ).rejects.toThrow(algoliaError);
  });

  test.each(possibleEvents)(
    'Should index output when event event %s occurs',
    async (_name, event) => {
      const listOutputsResponse = getListOutputResponse();
      outputControllerMock.fetch.mockResolvedValueOnce(listOutputsResponse);

      await indexHandler(event);

      expect(outputControllerMock.fetch).toHaveBeenCalledWith({
        filter: {
          eventId: 'event-id',
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
