import { WebhookPayload } from '../../../src/handlers/webhooks/webhook-sync-calendar';

export const createCalendarEvent: WebhookPayload = {
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
      id: {
        iv: 'calendar-id',
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
    version: 0,
  },
  timestamp: '2021-02-15T13:11:25Z',
};
