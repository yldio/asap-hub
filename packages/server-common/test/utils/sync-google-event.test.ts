import { calendar_v3 as calendarV3 } from 'googleapis';
import { syncEventFactory } from '../../src';
import * as typeNarrowing from '../../src/utils/type-narrowing';
import { getEventResponse } from '../fixtures/events.fixtures';
import { eventControllerMock } from '../mocks/event-controller.mock';
import { loggerMock as logger } from '../mocks/logger.mock';

describe('Sync calendar util hook', () => {
  const googleCalendarId = 'google-calendar-id';
  const calendarId = 'calendar-id';
  const defaultCalendarTimezone = 'Europe/Lisbon';
  const syncEvent = syncEventFactory(eventControllerMock, logger);

  beforeEach(() => {
    jest.spyOn(typeNarrowing, 'isCRNEventController').mockReturnValue(true);
  });
  afterEach(jest.resetAllMocks);

  test('Should create the event when it is not found', async () => {
    eventControllerMock.fetchByGoogleId.mockResolvedValueOnce(null);

    await syncEvent(
      getGoogleEvent(),
      googleCalendarId,
      calendarId,
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
      endDate: '2021-02-28T00:00:00.000Z',
      endDateTimeZone: 'Europe/Lisbon',
      status: 'Confirmed',
      calendar: calendarId,
      hidden: false,
      hideMeetingLink: false,
    });
  });

  test('Should create gp2 event when it is not found', async () => {
    eventControllerMock.fetchByGoogleId.mockResolvedValueOnce(null);
    jest
      .spyOn(typeNarrowing, 'isCRNEventController')
      .mockReturnValueOnce(false);

    await syncEvent(
      getGoogleEvent(),
      googleCalendarId,
      calendarId,
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
      endDate: '2021-02-28T00:00:00.000Z',
      endDateTimeZone: 'Europe/Lisbon',
      status: 'Confirmed',
      calendar: calendarId,
      hidden: false,
      hideMeetingLink: false,
    });
  });

  test('Should update event when it exists', async () => {
    eventControllerMock.fetchByGoogleId.mockResolvedValueOnce({
      ...getEventResponse(),
      id: 'event-id',
    });

    await syncEvent(
      getGoogleEvent(),
      googleCalendarId,
      calendarId,
      defaultCalendarTimezone,
    );

    expect(eventControllerMock.create).not.toHaveBeenCalled();
    expect(eventControllerMock.update).toHaveBeenCalledTimes(1);
    expect(eventControllerMock.update).toHaveBeenCalledWith('event-id', {
      googleId: '04rteq6hj3gfq9g3i8v2oqetvd',
      title: 'Event Title',
      description: 'Event Description',
      startDate: '2021-02-27T00:00:00.000Z',
      startDateTimeZone: 'Europe/Lisbon',
      endDate: '2021-02-28T00:00:00.000Z',
      endDateTimeZone: 'Europe/Lisbon',
      status: 'Confirmed',
      calendar: calendarId,
      hidden: false,
      hideMeetingLink: false,
    });
  });

  test('Should NOT update the event if the organiser of the event is different from the current calendar', async () => {
    const googleEvent = getGoogleEvent();
    googleEvent.organizer!.email = 'some-other-organizer';

    await expect(
      syncEvent(
        googleEvent,
        googleCalendarId,
        calendarId,
        defaultCalendarTimezone,
      ),
    ).rejects.toThrow('Invalid organiser');

    expect(eventControllerMock.create).not.toHaveBeenCalled();
    expect(eventControllerMock.update).not.toHaveBeenCalled();
  });

  describe('Hidden flag', () => {
    test('Should create an event and mark as hidden when the status is cancelled', async () => {
      const cancelledGoogleEvent = getGoogleEvent();
      cancelledGoogleEvent.status = 'cancelled';

      eventControllerMock.fetchByGoogleId.mockResolvedValueOnce(null);

      await syncEvent(
        cancelledGoogleEvent,
        googleCalendarId,
        calendarId,
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
        endDate: '2021-02-28T00:00:00.000Z',
        endDateTimeZone: 'Europe/Lisbon',
        status: 'Cancelled',
        calendar: 'calendar-id',
        hidden: true,
        hideMeetingLink: false,
      });
    });

    test('Should update to hidden when the event status changes to cancelled', async () => {
      const existingEvent = getEventResponse();
      existingEvent.status = 'Confirmed';

      eventControllerMock.fetchByGoogleId.mockResolvedValueOnce({
        ...existingEvent,
        id: 'event-id',
      });

      const updatedEvent = getGoogleEvent();
      updatedEvent.status = 'cancelled';

      await syncEvent(
        updatedEvent,
        googleCalendarId,
        calendarId,
        defaultCalendarTimezone,
      );

      expect(eventControllerMock.update).toHaveBeenCalledWith('event-id', {
        googleId: '04rteq6hj3gfq9g3i8v2oqetvd',
        title: 'Event Title',
        description: 'Event Description',
        startDate: '2021-02-27T00:00:00.000Z',
        startDateTimeZone: 'Europe/Lisbon',
        endDate: '2021-02-28T00:00:00.000Z',
        endDateTimeZone: 'Europe/Lisbon',
        status: 'Cancelled',
        calendar: calendarId,
        hidden: true,
        hideMeetingLink: false,
      });
    });

    test('Should remain hidden when the event status remains cancelled', async () => {
      const existingEvent = getEventResponse();
      existingEvent.status = 'Cancelled';
      existingEvent.hidden = true;

      eventControllerMock.fetchByGoogleId.mockResolvedValueOnce({
        ...existingEvent,

        id: 'event-id',
      });

      const updatedEvent = getGoogleEvent();
      updatedEvent.status = 'cancelled';

      await syncEvent(
        updatedEvent,
        googleCalendarId,
        calendarId,
        defaultCalendarTimezone,
      );

      expect(eventControllerMock.update).toHaveBeenCalledWith('event-id', {
        googleId: '04rteq6hj3gfq9g3i8v2oqetvd',
        title: 'Event Title',
        description: 'Event Description',
        startDate: '2021-02-27T00:00:00.000Z',
        startDateTimeZone: 'Europe/Lisbon',
        endDate: '2021-02-28T00:00:00.000Z',
        endDateTimeZone: 'Europe/Lisbon',
        status: 'Cancelled',
        calendar: calendarId,
        hidden: true,
        hideMeetingLink: false,
      });
    });

    test('Should remain visible (ie not hidden) when the event status remains cancelled', async () => {
      const existingEvent = getEventResponse();
      existingEvent.status = 'Cancelled';
      existingEvent.hidden = false;

      eventControllerMock.fetchByGoogleId.mockResolvedValueOnce({
        ...existingEvent,
        id: 'event-id',
      });

      const updatedEvent = getGoogleEvent();
      updatedEvent.status = 'cancelled';
      await syncEvent(
        updatedEvent,
        googleCalendarId,
        calendarId,
        defaultCalendarTimezone,
      );

      expect(eventControllerMock.update).toHaveBeenCalledWith('event-id', {
        googleId: '04rteq6hj3gfq9g3i8v2oqetvd',
        title: 'Event Title',
        description: 'Event Description',
        startDate: '2021-02-27T00:00:00.000Z',
        startDateTimeZone: 'Europe/Lisbon',
        endDate: '2021-02-28T00:00:00.000Z',
        endDateTimeZone: 'Europe/Lisbon',
        status: 'Cancelled',
        calendar: calendarId,
        hidden: false,
        hideMeetingLink: false,
      });
    });

    test('Should remain visible (ie not hidden) when the event hidden flag is missing', async () => {
      const existingEvent = getEventResponse();
      existingEvent.status = 'Cancelled';
      delete existingEvent.hidden;

      eventControllerMock.fetchByGoogleId.mockResolvedValueOnce({
        ...existingEvent,
        id: 'event-id',
      });

      const updatedEvent = getGoogleEvent();
      updatedEvent.status = 'cancelled';
      await syncEvent(
        updatedEvent,
        googleCalendarId,
        calendarId,
        defaultCalendarTimezone,
      );

      expect(eventControllerMock.update).toHaveBeenCalledWith('event-id', {
        googleId: '04rteq6hj3gfq9g3i8v2oqetvd',
        title: 'Event Title',
        description: 'Event Description',
        startDate: '2021-02-27T00:00:00.000Z',
        startDateTimeZone: 'Europe/Lisbon',
        endDate: '2021-02-28T00:00:00.000Z',
        endDateTimeZone: 'Europe/Lisbon',
        status: 'Cancelled',
        calendar: calendarId,
        hidden: false,
        hideMeetingLink: false,
      });
    });

    test('Should remain hidden when the status changes from confirmed to tentative', async () => {
      const existingEvent = getEventResponse();
      existingEvent.status = 'Confirmed';
      existingEvent.hidden = true;

      eventControllerMock.fetchByGoogleId.mockResolvedValueOnce({
        ...existingEvent,
        id: 'event-id',
      });

      const updatedEvent = getGoogleEvent();
      updatedEvent.status = 'tentative';
      await syncEvent(
        updatedEvent,
        googleCalendarId,
        calendarId,
        defaultCalendarTimezone,
      );

      expect(eventControllerMock.update).toHaveBeenCalledWith('event-id', {
        googleId: '04rteq6hj3gfq9g3i8v2oqetvd',
        title: 'Event Title',
        description: 'Event Description',
        startDate: '2021-02-27T00:00:00.000Z',
        startDateTimeZone: 'Europe/Lisbon',
        endDate: '2021-02-28T00:00:00.000Z',
        endDateTimeZone: 'Europe/Lisbon',
        status: 'Tentative',
        calendar: calendarId,
        hidden: true,
        hideMeetingLink: false,
      });
    });
  });

  describe('Hide Meeting Link', () => {
    test('Should create an event and mark the field hideMeetingLink as false', async () => {
      const event = getGoogleEvent();

      eventControllerMock.fetchByGoogleId.mockResolvedValueOnce(null);

      await syncEvent(
        event,
        googleCalendarId,
        calendarId,
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
        endDate: '2021-02-28T00:00:00.000Z',
        endDateTimeZone: 'Europe/Lisbon',
        status: 'Confirmed',
        calendar: calendarId,
        hidden: false,
        hideMeetingLink: false,
      });
    });
  });

  describe('Should throw when a remote operation throws', () => {
    test('fetchByGoogleId', async () => {
      eventControllerMock.fetchByGoogleId.mockRejectedValueOnce(new Error());
      await expect(
        syncEvent(
          getGoogleEvent(),
          googleCalendarId,
          calendarId,
          defaultCalendarTimezone,
        ),
      ).rejects.toThrow();
    });

    test('update', async () => {
      eventControllerMock.fetchByGoogleId.mockResolvedValueOnce({
        ...getEventResponse(),
        id: 'event-id',
      });
      eventControllerMock.update.mockRejectedValueOnce(new Error());
      await expect(
        syncEvent(
          getGoogleEvent(),
          googleCalendarId,
          calendarId,
          defaultCalendarTimezone,
        ),
      ).rejects.toThrow();
    });

    test('create', async () => {
      eventControllerMock.fetchByGoogleId.mockResolvedValueOnce(null);
      eventControllerMock.create.mockRejectedValueOnce(new Error());
      await expect(
        syncEvent(
          getGoogleEvent(),
          googleCalendarId,
          calendarId,
          defaultCalendarTimezone,
        ),
      ).rejects.toThrow();
    });
  });

  test('Should create event - with dateTime', async () => {
    eventControllerMock.fetchByGoogleId.mockResolvedValueOnce(null);

    await syncEvent(
      {
        ...getGoogleEvent(),
        end: { dateTime: '2021-02-27T10:00:00Z', timeZone: 'Europe/London' },
      },
      googleCalendarId,
      calendarId,
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
      calendar: calendarId,
      hidden: false,
      hideMeetingLink: false,
    });
  });

  test('Should create event - converts dates to UTC', async () => {
    eventControllerMock.fetchByGoogleId.mockResolvedValueOnce(null);

    await syncEvent(
      {
        ...getGoogleEvent(),
        end: {
          dateTime: '2040-09-13T13:30:00-04:00',
          timeZone: 'America/New_York',
        },
      },
      googleCalendarId,
      calendarId,
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
      calendar: calendarId,
      hidden: false,
      hideMeetingLink: false,
    });
  });

  describe('Validation test', () => {
    test('Should reject when validation fails - empty object', async () => {
      await expect(
        syncEvent({}, googleCalendarId, calendarId, defaultCalendarTimezone),
      ).rejects.toThrow();
    });

    test('Should reject when validation fails - missing fields: id', async () => {
      await expect(
        syncEvent(
          { ...getGoogleEvent(), id: undefined },
          googleCalendarId,
          calendarId,
          defaultCalendarTimezone,
        ),
      ).rejects.toThrow();
    });

    test('Should reject when validation fails - missing dates', async () => {
      await expect(
        syncEvent(
          { ...getGoogleEvent(), start: {}, end: {} },
          googleCalendarId,
          calendarId,
          defaultCalendarTimezone,
        ),
      ).rejects.toThrow();
    });

    test('Should reject when validation fails - bad dates', async () => {
      await expect(
        syncEvent(
          {
            ...getGoogleEvent(),
            start: { timeZone: 'notice-no-dates' },
            end: { timeZone: 'notice-no-dates' },
          },
          googleCalendarId,
          calendarId,
          defaultCalendarTimezone,
        ),
      ).rejects.toThrow();
    });
  });
});

const getGoogleEvent = (): calendarV3.Schema$Event => ({
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
    email: 'google-calendar-id',
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
});
