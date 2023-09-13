import Boom from '@hapi/boom';
import { indexTeamEventsHandler } from '../../../src/handlers/event/algolia-index-team-events-handler';
import {
  getListEventResponse,
  getEventDataObject,
} from '../../fixtures/events.fixtures';
import {
  getTeamCreateEvent,
  getTeamDeleteEvent,
  TeamEventGenerator,
  getTeamUnpublishedEvent,
  getTeamUpdateEvent,
} from '../../fixtures/teams.fixtures';
import { toPayload } from '../../helpers/algolia';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { eventControllerMock } from '../../mocks/event.controller.mock';

const mapPayload = toPayload('event');

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
const possibleEvents: [string, TeamEventGenerator][] = [
  ['created', getTeamCreateEvent],
  ['updated', getTeamUpdateEvent],
  ['unpublished', getTeamUnpublishedEvent],
  ['deleted', getTeamDeleteEvent],
];

jest.mock('../../../src/utils/logger');
describe('Index Events on Team event handler', () => {
  const indexHandler = indexTeamEventsHandler(
    eventControllerMock,
    algoliaSearchClientMock,
  );
  afterEach(() => jest.clearAllMocks());

  test('Should throw an error and do not trigger algolia when the team request fails with another error code', async () => {
    eventControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(indexHandler(getTeamCreateEvent('team-id'))).rejects.toThrow(
      Boom.badData(),
    );
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    const listEventResponse = getListEventResponse();
    eventControllerMock.fetch.mockResolvedValueOnce(listEventResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(getTeamUpdateEvent('team-id'))).rejects.toThrow(
      algoliaError,
    );
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

    await indexHandler(getTeamUpdateEvent('team-id'));

    expect(algoliaSearchClientMock.saveMany).toHaveBeenCalledWith([
      {
        type: 'event',
        data: { ...getEventDataObject(), id: 'event-2', hidden: false },
      },
    ]);
  });

  test.each(possibleEvents)(
    'Should index event when team event %s occurs',
    async (_name, event) => {
      const listEventResponse = getListEventResponse();
      eventControllerMock.fetch.mockResolvedValueOnce(listEventResponse);

      await indexHandler(event('team-id'));

      expect(eventControllerMock.fetch).toHaveBeenCalledWith({
        filter: {
          teamId: 'teamId',
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
