import Boom from '@hapi/boom';
import { toPayload } from '../../helpers/algolia';
import {
  createEvent,
  deleteEvent,
  TeamEventGenerator,
  unpublishedEvent,
  updateEvent,
} from '../../fixtures/teams.fixtures';
import { algoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { eventControllerMock } from '../../mocks/event-controller.mock';
import { indexTeamEventsHandler } from '../../../src/handlers/event/index-team-events-handler';
import { listEventResponse } from '../../fixtures/events.fixtures';

const mapPayload = toPayload('event');

const possibleEvents: [string, TeamEventGenerator][] = [
  ['created', createEvent],
  ['updated', updateEvent],
  ['unpublished', unpublishedEvent],
  ['deleted', deleteEvent],
];

describe('Index Events on Team event handler', () => {
  const indexHandler = indexTeamEventsHandler(
    eventControllerMock,
    algoliaSearchClientMock,
  );
  afterEach(() => jest.clearAllMocks());

  test('Should throw an error and do not trigger algolia when the team request fails with another error code', async () => {
    eventControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(indexHandler(createEvent('team-id'))).rejects.toThrow(
      Boom.badData(),
    );
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    eventControllerMock.fetch.mockResolvedValueOnce(listEventResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(indexHandler(updateEvent('team-id'))).rejects.toThrow(
      algoliaError,
    );
  });

  test.each(possibleEvents)(
    'Should index event when team event %s occurs',
    async (name, event) => {
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
