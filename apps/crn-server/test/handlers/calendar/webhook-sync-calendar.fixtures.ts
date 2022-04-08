import { CalendarPayload } from '../../../src/handlers/event-bus';
export const getCalendarCreateEvent = (
  version: number = 0,
): CalendarPayload => ({
  type: 'CalendarsCreated',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Created',
    id: 'cc5f74e0-c611-4043-abde-cd3c0d5a3414',
    data: {
      name: {
        iv: 'Awesome Calendar',
      },
      googleCalendarId: {
        iv: 'calendar-id@group.calendar.google.com',
      },
      color: {
        iv: '#691426',
      },
    },
    version,
  },
});

export const getCalendarUpdateEvent = (
  version: number = 42,
): CalendarPayload => ({
  ...getCalendarCreateEvent(),
  type: 'CalendarsUpdated',
  payload: {
    ...getCalendarCreateEvent(version).payload,
    dataOld: {
      name: {
        iv: 'Awesome Calendar',
      },
      googleCalendarId: {
        iv: 'old-calendar-id@group.calendar.google.com',
      },
      color: {
        iv: '#691426',
      },
      resourceId: {
        iv: 'resource-id',
      },
    },
  },
});
