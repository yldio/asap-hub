import { calendar_v3 as calendarV3 } from 'googleapis';
import { syncEventFactory } from '../../src/utils/sync-google-event';
import { eventControllerMock } from '../mocks/event-controller.mock';

describe('Sync calendar util hook', () => {
  const calendarId = 'squidex-calendar-id';
  const defaultCalendarTimezone = 'Europe/Lisbon';
  const syncEvent = syncEventFactory(eventControllerMock, calendarId);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should upsert event - with date', async () => {
    await syncEvent(event, defaultCalendarTimezone);

    expect(eventControllerMock.upsert).toHaveBeenCalledTimes(1);
    expect(eventControllerMock.upsert).toHaveBeenCalledWith(
      '04rteq6hj3gfq9g3i8v2oqetvd',
      {
        title: 'Event Title',
        description: 'Event Description',
        startDate: '2021-02-27',
        startDateTimeZone: 'Europe/Lisbon',
        endDate: '2021-02-28',
        endDateTimeZone: 'Europe/Lisbon',
        status: 'confirmed',
        calendar: ['squidex-calendar-id'],
        tags: [],
      },
    );
  });

  test('Should upsert event - with dateTime', async () => {
    await syncEvent(
      {
        ...event,
        end: { dateTime: '2021-02-27T10:00:00Z', timeZone: 'Europe/London' },
      },
      defaultCalendarTimezone,
    );

    expect(eventControllerMock.upsert).toHaveBeenCalledTimes(1);
    expect(eventControllerMock.upsert).toHaveBeenCalledWith(
      '04rteq6hj3gfq9g3i8v2oqetvd',
      {
        title: 'Event Title',
        description: 'Event Description',
        startDate: '2021-02-27',
        startDateTimeZone: 'Europe/Lisbon',
        endDate: '2021-02-27T10:00:00Z',
        endDateTimeZone: 'Europe/London',
        status: 'confirmed',
        calendar: ['squidex-calendar-id'],
        tags: [],
      },
    );
  });

  describe('Validation test', () => {
    test('Should not upsert when validation fails - empty object', async () => {
      await syncEvent({}, defaultCalendarTimezone);
      expect(eventControllerMock.upsert).not.toHaveBeenCalled();
    });

    test('Should not upsert when validation fails - missing fields', async () => {
      await syncEvent({ ...event, id: undefined }, defaultCalendarTimezone);
      await syncEvent(
        { ...event, summary: undefined },
        defaultCalendarTimezone,
      );
      expect(eventControllerMock.upsert).not.toHaveBeenCalled();
    });

    test('Should not upsert when validation fails - missing dates', async () => {
      await syncEvent(
        { ...event, start: {}, end: {} },
        defaultCalendarTimezone,
      );
      expect(eventControllerMock.upsert).not.toHaveBeenCalled();
    });

    test('Should not upsert when validation fails - bad dates', async () => {
      await syncEvent(
        {
          ...event,
          start: { timeZone: 'notice-no-dates' },
          end: { timeZone: 'notice-no-dates' },
        },
        defaultCalendarTimezone,
      );
      expect(eventControllerMock.upsert).not.toHaveBeenCalled();
    });
  });
});

const event: calendarV3.Schema$Event = {
  kind: 'calendar#event',
  etag: '"3228679679662000"',
  id: '04rteq6hj3gfq9g3i8v2oqetvd',
  status: 'confirmed',
  htmlLink:
    'https://www.google.com/calendar/event?eid=MDRydGVxNmhqM2dmcTlnM2k4djJvcWV0dmQgY181dTNiYWs4ZGE3Z3Nma2QzNGF0azAyMTFyZ0Bn',
  created: '2021-02-26T11:43:59.000Z',
  updated: '2021-02-26T11:43:59.831Z',
  summary: 'Event Title',
  description: 'Event Description',
  creator: {
    email: 'yld@asap.science',
  },
  organizer: {
    email: 'c_5u3bak8da7gsfkd34atk0211rg@group.calendar.google.com',
    displayName: 'New Test',
    self: true,
  },
  start: {
    date: '2021-02-27',
  },
  end: {
    date: '2021-02-28',
  },
  transparency: 'transparent',
  iCalUID: '04rteq6hj3gfq9g3i8v2oqetvd@google.com',
  sequence: 0,
  reminders: {
    useDefault: false,
  },
};
