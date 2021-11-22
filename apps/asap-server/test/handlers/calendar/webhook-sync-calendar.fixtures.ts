import { WebhookPayload, Calendar } from '@asap-hub/squidex';

export const getCalendarCreateEvent = (
  version: number = 0,
): WebhookPayload<Calendar> => ({
  type: 'CalendarsCreated',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Created',
    id: 'cc5f74e0-c611-4043-abde-cd3c0d5a3414',
    created: '2021-02-15T13:11:25Z',
    lastModified: '2021-02-15T13:11:25Z',
    createdBy: 'subject:5ff5f26d7c171c647fd68bb4',
    lastModifiedBy: 'subject:5ff5f26d7c171c647fd68bb4',
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
    status: 'Draft',
    partition: -1848372806,
    schemaId: '92d15359-5c27-47e7-8e05-6e85eee8455c,calendars',
    actor: 'subject:5ff5f26d7c171c647fd68bb4',
    appId: 'efd5bee9-bbb9-42f0-8c60-6dccf71ab542,asap-hub-dev',
    timestamp: '2021-02-15T13:11:25Z',
    name: 'CalendarsCreated',
    version,
  },
  timestamp: '2021-02-15T13:11:25Z',
});

export const getCalendarUpdateEvent = (
  version: number = 42,
): WebhookPayload<Calendar> => ({
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
