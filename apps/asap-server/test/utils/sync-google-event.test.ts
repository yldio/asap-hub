import { calendar_v3 as calendarV3 } from 'googleapis';
import { syncEventFactory } from '../../src/utils/sync-google-event';
import { eventControllerMock } from '../mocks/event-controller.mock';
import { restEvent } from '../fixtures/events.fixtures';
import { RestEvent } from '@asap-hub/squidex';

describe('Sync calendar util hook', () => {
  const calendarId = 'squidex-calendar-id';
  const defaultCalendarTimezone = 'Europe/Lisbon';
  const syncEvent = syncEventFactory(eventControllerMock, calendarId);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should create event when it is not found', async () => {
    eventControllerMock.fetchByGoogleId.mockResolvedValueOnce(null);
    await syncEvent(event, defaultCalendarTimezone);

    expect(eventControllerMock.update).not.toHaveBeenCalled();
    expect(eventControllerMock.create).toHaveBeenCalledTimes(1);
    expect(eventControllerMock.create).toHaveBeenCalledWith({
      googleId: '04rteq6hj3gfq9g3i8v2oqetvd',
      title: 'Event Title',
      description: 'Event Description',
      startDate: '2021-02-27T00:00:00.000Z',
      startDateTimeZone: 'Europe/Lisbon',
      endDate: '2021-02-28T00:00:00.000Z',
      endDateTimeZone: 'Europe/Lisbon',
      status: 'Confirmed',
      calendar: ['squidex-calendar-id'],
      tags: [],
      hidden: false,
    });
  });

  test('Should update event when it exists', async () => {
    eventControllerMock.fetchByGoogleId.mockResolvedValueOnce(restEvent);
    await syncEvent(event, defaultCalendarTimezone);

    expect(eventControllerMock.create).not.toHaveBeenCalled();
    expect(eventControllerMock.update).toHaveBeenCalledTimes(1);
    expect(eventControllerMock.update).toHaveBeenCalledWith(
      'squidex-event-id',
      {
        googleId: '04rteq6hj3gfq9g3i8v2oqetvd',
        title: 'Event Title',
        description: 'Event Description',
        startDate: '2021-02-27T00:00:00.000Z',
        startDateTimeZone: 'Europe/Lisbon',
        endDate: '2021-02-28T00:00:00.000Z',
        endDateTimeZone: 'Europe/Lisbon',
        status: 'Confirmed',
        calendar: ['squidex-calendar-id'],
        hidden: false,
      },
    );
  });

  describe('Hidden flag', () => {
    test('Should update to hidden when the event status changes to cancelled', async () => {
      const existingEvent: RestEvent = {
        ...restEvent,
        data: {
          ...restEvent.data,
          status: { iv: 'Confirmed' },
        },
      };

      eventControllerMock.fetchByGoogleId.mockResolvedValueOnce(existingEvent);

      const updatedEvent = {
        ...event,
        status: 'cancelled',
      };
      await syncEvent(updatedEvent, defaultCalendarTimezone);

      expect(eventControllerMock.update).toHaveBeenCalledWith(
        'squidex-event-id',
        {
          googleId: '04rteq6hj3gfq9g3i8v2oqetvd',
          title: 'Event Title',
          description: 'Event Description',
          startDate: '2021-02-27T00:00:00.000Z',
          startDateTimeZone: 'Europe/Lisbon',
          endDate: '2021-02-28T00:00:00.000Z',
          endDateTimeZone: 'Europe/Lisbon',
          status: 'Cancelled',
          calendar: ['squidex-calendar-id'],
          hidden: true,
        },
      );
    });

    test('Should remain hidden when the event status remains cancelled', async () => {
      const existingEvent: RestEvent = {
        ...restEvent,
        data: {
          ...restEvent.data,
          status: { iv: 'Cancelled' },
          hidden: {
            iv: true,
          },
        },
      };

      eventControllerMock.fetchByGoogleId.mockResolvedValueOnce(existingEvent);

      const updatedEvent = {
        ...event,
        status: 'cancelled',
      };
      await syncEvent(updatedEvent, defaultCalendarTimezone);

      expect(eventControllerMock.update).toHaveBeenCalledWith(
        'squidex-event-id',
        {
          googleId: '04rteq6hj3gfq9g3i8v2oqetvd',
          title: 'Event Title',
          description: 'Event Description',
          startDate: '2021-02-27T00:00:00.000Z',
          startDateTimeZone: 'Europe/Lisbon',
          endDate: '2021-02-28T00:00:00.000Z',
          endDateTimeZone: 'Europe/Lisbon',
          status: 'Cancelled',
          calendar: ['squidex-calendar-id'],
          hidden: true,
        },
      );
    });

    test('Should remain visible (ie not hidden) when the event status remains cancelled', async () => {
      const existingEvent: RestEvent = {
        ...restEvent,
        data: {
          ...restEvent.data,
          status: { iv: 'Cancelled' },
          hidden: {
            iv: false,
          },
        },
      };

      eventControllerMock.fetchByGoogleId.mockResolvedValueOnce(existingEvent);

      const updatedEvent = {
        ...event,
        status: 'cancelled',
      };
      await syncEvent(updatedEvent, defaultCalendarTimezone);

      expect(eventControllerMock.update).toHaveBeenCalledWith(
        'squidex-event-id',
        {
          googleId: '04rteq6hj3gfq9g3i8v2oqetvd',
          title: 'Event Title',
          description: 'Event Description',
          startDate: '2021-02-27T00:00:00.000Z',
          startDateTimeZone: 'Europe/Lisbon',
          endDate: '2021-02-28T00:00:00.000Z',
          endDateTimeZone: 'Europe/Lisbon',
          status: 'Cancelled',
          calendar: ['squidex-calendar-id'],
          hidden: false,
        },
      );
    });

    test('Should remain hidden when the status changes from confirmed to tentative', async () => {
      const existingEvent: RestEvent = {
        ...restEvent,
        data: {
          ...restEvent.data,
          status: { iv: 'Confirmed' },
          hidden: {
            iv: true,
          },
        },
      };

      eventControllerMock.fetchByGoogleId.mockResolvedValueOnce(existingEvent);

      const updatedEvent = {
        ...event,
        status: 'tentative',
      };
      await syncEvent(updatedEvent, defaultCalendarTimezone);

      expect(eventControllerMock.update).toHaveBeenCalledWith(
        'squidex-event-id',
        {
          googleId: '04rteq6hj3gfq9g3i8v2oqetvd',
          title: 'Event Title',
          description: 'Event Description',
          startDate: '2021-02-27T00:00:00.000Z',
          startDateTimeZone: 'Europe/Lisbon',
          endDate: '2021-02-28T00:00:00.000Z',
          endDateTimeZone: 'Europe/Lisbon',
          status: 'Tentative',
          calendar: ['squidex-calendar-id'],
          hidden: true,
        },
      );
    });
  });

  describe('Should throw when a remote operation throws', () => {
    test('fetchByGoogleId', async () => {
      eventControllerMock.fetchByGoogleId.mockRejectedValueOnce(
        new Error('Squidex'),
      );
      await expect(syncEvent(event, defaultCalendarTimezone)).rejects.toThrow();
    });

    test('update', async () => {
      eventControllerMock.fetchByGoogleId.mockResolvedValueOnce(restEvent);
      eventControllerMock.update.mockRejectedValueOnce(new Error('Squidex'));
      await expect(syncEvent(event, defaultCalendarTimezone)).rejects.toThrow();
    });

    test('create', async () => {
      eventControllerMock.fetchByGoogleId.mockResolvedValueOnce(null);
      eventControllerMock.create.mockRejectedValueOnce(new Error('Squidex'));
      await expect(syncEvent(event, defaultCalendarTimezone)).rejects.toThrow();
    });
  });

  test('Should create event - with dateTime', async () => {
    eventControllerMock.fetchByGoogleId.mockResolvedValueOnce(null);

    await syncEvent(
      {
        ...event,
        end: { dateTime: '2021-02-27T10:00:00Z', timeZone: 'Europe/London' },
      },
      defaultCalendarTimezone,
    );

    expect(eventControllerMock.update).not.toHaveBeenCalled();
    expect(eventControllerMock.create).toHaveBeenCalledTimes(1);
    expect(eventControllerMock.create).toHaveBeenCalledWith({
      googleId: '04rteq6hj3gfq9g3i8v2oqetvd',
      title: 'Event Title',
      description: 'Event Description',
      startDate: '2021-02-27T00:00:00.000Z',
      startDateTimeZone: 'Europe/Lisbon',
      endDate: '2021-02-27T10:00:00.000Z',
      endDateTimeZone: 'Europe/London',
      status: 'Confirmed',
      calendar: ['squidex-calendar-id'],
      tags: [],
      hidden: false,
    });
  });

  test('Should create event - converts dates to UTC', async () => {
    eventControllerMock.fetchByGoogleId.mockResolvedValueOnce(null);

    await syncEvent(
      {
        ...event,
        end: {
          dateTime: '2040-09-13T13:30:00-04:00',
          timeZone: 'America/New_York',
        },
      },
      defaultCalendarTimezone,
    );

    expect(eventControllerMock.update).not.toHaveBeenCalled();
    expect(eventControllerMock.create).toHaveBeenCalledTimes(1);
    expect(eventControllerMock.create).toHaveBeenCalledWith({
      googleId: '04rteq6hj3gfq9g3i8v2oqetvd',
      title: 'Event Title',
      description: 'Event Description',
      startDate: '2021-02-27T00:00:00.000Z',
      startDateTimeZone: 'Europe/Lisbon',
      endDate: '2040-09-13T17:30:00.000Z',
      endDateTimeZone: 'America/New_York',
      status: 'Confirmed',
      calendar: ['squidex-calendar-id'],
      tags: [],
      hidden: false,
    });
  });

  describe('Validation test', () => {
    test('Should reject when validation fails - empty object', async () => {
      await expect(syncEvent({}, defaultCalendarTimezone)).rejects.toThrow();
    });

    test('Should reject when validation fails - missing fields: id', async () => {
      await expect(
        syncEvent({ ...event, id: undefined }, defaultCalendarTimezone),
      ).rejects.toThrow();
    });

    test('Should reject when validation fails - missing fields: summary', async () => {
      await expect(
        syncEvent({ ...event, summary: undefined }, defaultCalendarTimezone),
      ).rejects.toThrow();
    });

    test('Should reject when validation fails - missing dates', async () => {
      await expect(
        syncEvent({ ...event, start: {}, end: {} }, defaultCalendarTimezone),
      ).rejects.toThrow();
    });

    test('Should reject when validation fails - bad dates', async () => {
      await expect(
        syncEvent(
          {
            ...event,
            start: { timeZone: 'notice-no-dates' },
            end: { timeZone: 'notice-no-dates' },
          },
          defaultCalendarTimezone,
        ),
      ).rejects.toThrow();
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
