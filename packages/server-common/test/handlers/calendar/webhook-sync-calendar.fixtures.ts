import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import { CalendarEvent, WebhookDetail } from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';
import { CalendarPayload } from '../../../src';
import { createEventBridgeEventMock } from '../../helpers/events';

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

export const getCalendarContentfulWebhookDetail = (): WebhookDetail<
  ContentfulWebhookPayload<'calendars'>
> => ({
  resourceId: 'calendar-1',
  metadata: {
    tags: [],
  },
  sys: {
    type: 'Entry',
    id: '2pNu5cp2GoyZLdW7Uqh8yQ',
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '5v6w5j61tndm',
      },
    },
    environment: {
      sys: {
        id: 'Development',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: 'calendars',
      },
    },
    createdBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '2SHvngTJ24kxZGAPDJ8J1y',
      },
    },
    updatedBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '2SHvngTJ24kxZGAPDJ8J1y',
      },
    },
    revision: 1,
    createdAt: '2023-04-10T10:33:27.249Z',
    updatedAt: '2023-04-10T10:33:27.249Z',
  },
  fields: {
    name: {
      'en-US': 'Tech 4a - iPSCs - 3D & Co-cultures',
    },
    googleCalendarId: {
      'en-US': '3@group.calendar.google.com',
    },
    color: {
      'en-US': '#2952A3',
    },
  },
});

export const getCalendarContentfulEvent = (): EventBridgeEvent<
  CalendarEvent,
  WebhookDetail<ContentfulWebhookPayload<'calendars'>>
> =>
  createEventBridgeEventMock(
    getCalendarContentfulWebhookDetail(),
    'CalendarsPublished',
    'calendar-1',
  );
