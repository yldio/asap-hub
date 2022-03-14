import { calendar_v3 } from 'googleapis';

export const listEventsResponse: calendar_v3.Schema$Events = {
  kind: 'calendar#events',
  etag: '"p330bru6hqvuus0g"',
  summary: 'New Test',
  updated: '2021-02-22T14:18:36.088Z',
  timeZone: 'Europe/Lisbon',
  accessRole: 'owner',
  defaultReminders: [],
  nextSyncToken: 'next-sync-token-1',
  items: [
    {
      kind: 'calendar#event',
      etag: '"3226988196172000"',
      id: 'google-event-id-1',
      status: 'confirmed',
      htmlLink: 'https://www.google.com/calendar/event?eid=event-id',
      created: '2021-02-16T16:48:18.000Z',
      updated: '2021-02-16T16:48:18.086Z',
      summary: 'test test',
      creator: {
        email: 'yld@asap.science',
      },
      organizer: {
        email: 'calendar-id@group.calendar.google.com',
        displayName: 'New Test',
        self: true,
      },
      start: {
        date: '2021-02-16',
      },
      end: {
        date: '2021-02-17',
      },
      transparency: 'transparent',
      iCalUID: '152hus88kaljgl5bcq3cclp4dt@google.com',
      sequence: 0,
      reminders: {
        useDefault: false,
      },
    },
    {
      kind: 'calendar#event',
      etag: '"3228007032176000"',
      id: 'google-event-id-2',
      status: 'confirmed',
      htmlLink:
        'https://www.google.com/calendar/event?eid=M3R1OGM2NTIxYnJpaHNmYnN1ZjBlYWF2ZjIgY181dTNiYWs4ZGE3Z3Nma2QzNGF0azAyMTFyZ0Bn',
      created: '2021-02-22T14:18:36.000Z',
      updated: '2021-02-22T14:18:36.088Z',
      creator: {
        email: 'yld@asap.science',
      },
      organizer: {
        email: 'calendar-id@group.calendar.google.com',
        displayName: 'New Test',
        self: true,
      },
      start: {
        dateTime: '2021-02-25T12:30:00Z',
        timeZone: 'Europe/Helsinki',
      },
      end: {
        dateTime: '2021-02-25T13:30:00Z',
        timeZone: 'Europe/Helsinki',
      },
      iCalUID: '3tu8c65avf2@google.com',
      sequence: 0,
      reminders: {
        useDefault: true,
      },
    },
  ],
};
