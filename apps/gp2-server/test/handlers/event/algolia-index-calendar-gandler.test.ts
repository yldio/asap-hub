import { gp2 as gp2Model } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { CalendarPayload } from '../../../src/handlers/event-bus';
import { indexCalendarEventsHandler } from '../../../src/handlers/event/algolia-index-calendar-handler';
import { getListEventResponse } from '../../fixtures/event.fixtures';
import { getCalendarEvent } from '../../fixtures/calendar.fixtures';
import { getAlgoliaSearchClientMock } from '../../mocks/algolia-client.mock';
import { eventControllerMock } from '../../mocks/event.controller.mock';
import { toPayload } from '../../utils/algolia';

const mapPayload = toPayload('event');

const algoliaSearchClientMock = getAlgoliaSearchClientMock();
const possibleEvents: [
  string,
  EventBridgeEvent<gp2Model.CalendarEvent, CalendarPayload>,
][] = [
  ['created', getCalendarEvent('calendar-name', 'CalendarsCreated')],
  ['updated', getCalendarEvent('calendar-name', 'CalendarsUpdated')],
  ['unpublished', getCalendarEvent('calendar-name', 'CalendarsUnpublished')],
  ['deleted', getCalendarEvent('calendar-name', 'CalendarsDeleted')],
];

jest.mock('../../../src/utils/logger');
describe('Index Events on External User event handler', () => {
  const indexHandler = indexCalendarEventsHandler(
    eventControllerMock,
    algoliaSearchClientMock,
  );
  beforeEach(jest.resetAllMocks);

  test('Should throw an error and do not trigger algolia when the user request fails with another error code', async () => {
    eventControllerMock.fetch.mockRejectedValue(Boom.badData());

    await expect(
      indexHandler(getCalendarEvent('calendar-name', 'CalendarsCreated')),
    ).rejects.toThrow(Boom.badData());
    expect(algoliaSearchClientMock.saveMany).not.toHaveBeenCalled();
  });

  test('Should throw the algolia error when saving the record fails', async () => {
    const algoliaError = new Error('ERROR');

    const listEventsResponse = getListEventResponse();
    eventControllerMock.fetch.mockResolvedValueOnce(listEventsResponse);
    algoliaSearchClientMock.saveMany.mockRejectedValueOnce(algoliaError);

    await expect(
      indexHandler(getCalendarEvent('calendar-name', 'CalendarsUpdated')),
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
          calendarName: 'calendar-name',
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
