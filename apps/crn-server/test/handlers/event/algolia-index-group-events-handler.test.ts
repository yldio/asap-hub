import { InterestGroupEvent } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { InterestGroupPayload } from '../../../src/handlers/event-bus';
import { indexGroupEventsHandler } from '../../../src/handlers/event/algolia-index-group-events-handler';
import {
  getListEventResponse,
  getEventDataObject,
} from '../../fixtures/events.fixtures';
import { getInterestGroupEvent } from '../../fixtures/interest-groups.fixtures';
import { toPayload } from '../../helpers/algolia';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { eventControllerMock } from '../../mocks/event.controller.mock';
const algoliaSearchClientMock = getAlgoliaSearchClientMock();

const mapPayload = toPayload('event');

const possibleEvents: [
  string,
  EventBridgeEvent<InterestGroupEvent, InterestGroupPayload>,
][] = [
  ['created', getInterestGroupEvent('group-id', 'InterestGroupsPublished')],
  [
    'unpublished',
    getInterestGroupEvent('group-id', 'InterestGroupsUnpublished'),
  ],
];

jest.mock('../../../src/utils/logger');
describe('Index Events on Group event handler', () => {
  const indexHandler = indexGroupEventsHandler(
    eventControllerMock,
    algoliaSearchClientMock,
  );
  afterEach(() => jest.clearAllMocks());

  test('Should throw an error and do not trigger algolia when the group request fails with another error code', async () => {
    eventControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(
        getInterestGroupEvent('group-id', 'InterestGroupsPublished'),
      ),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    const listEventResponse = getListEventResponse();
    eventControllerMock.fetch.mockResolvedValueOnce(listEventResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(
        getInterestGroupEvent('group-id', 'InterestGroupsPublished'),
      ),
    ).rejects.toThrow(algoliaError);
  });

  test('Should not index hidden events', async () => {
    eventControllerMock.fetch.mockResolvedValueOnce({
      total: 3,
      items: [
        {
          ...getEventDataObject(),
          id: 'event-1',
          hidden: true,
        },
        {
          ...getEventDataObject(),
          id: 'event-2',
          hidden: false,
        },
        {
          ...getEventDataObject(),
          id: 'event-3',
          hidden: true,
        },
      ],
    });

    await indexHandler(
      getInterestGroupEvent('group-id', 'InterestGroupsPublished'),
    );

    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith([
      {
        type: 'event',
        data: {
          ...getEventDataObject(),
          _tags: [],
          id: 'event-2',
          hidden: false,
        },
      },
    ]);
  });

  test('Should save event with _tags', async () => {
    eventControllerMock.fetch.mockResolvedValueOnce({
      total: 1,
      items: [
        {
          ...getEventDataObject(),
          tags: [
            { id: '1', name: 'Proteins' },
            { id: '2', name: 'Cell Biology' },
          ],
        },
      ],
    });

    await indexHandler(
      getInterestGroupEvent('group-id', 'InterestGroupsPublished'),
    );

    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith([
      {
        type: 'event',
        data: expect.objectContaining({
          _tags: ['Proteins', 'Cell Biology'],
        }),
      },
    ]);
  });

  test.each(possibleEvents)(
    'Should index event when group event %s occurs',
    async (_name, event) => {
      const listEventResponse = getListEventResponse();

      eventControllerMock.fetch.mockResolvedValueOnce(listEventResponse);

      await indexHandler(event);

      expect(eventControllerMock.fetch).toHaveBeenCalledWith({
        filter: {
          interestGroupId: 'group-id',
        },
        skip: 0,
        take: 8,
      });
      expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith(
        listEventResponse.items
          .map(mapPayload)
          .map((item) => ({ ...item, data: { ...item.data, _tags: [] } })),
      );
    },
  );
});
