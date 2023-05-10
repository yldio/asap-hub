import { EventBridgeEvent } from 'aws-lambda';
import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import {
  CalendarEvent,
  WebhookDetail,
  CalendarDataObject,
} from '@asap-hub/model';
import {
  CalendarContentfulPayload,
  CalendarPayload,
  CalendarSquidexPayload,
} from '../../../src';
import { createEventBridgeEventMock } from '../../helpers/events';

export const getCalendarDataObject = (): CalendarDataObject => ({
  id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
  color: '#2952A3',
  name: 'Tech 4a - iPSCs - 3D & Co-cultures',
  syncToken: 'sync-token',
  resourceId: 'resource-id',
  expirationDate: 1617196357000,
  googleCalendarId: '3@group.calendar.google.com',
  version: 42,
  groups: [{ id: 'group-id-1', active: true }],
  workingGroups: [{ id: '123', complete: false }],
});

export const getCalendarCreateEvent = (
  version: number = 0,
): CalendarSquidexPayload => ({
  type: 'CalendarsCreated',
  timestamp: '2021-01-07T16:44:09Z',
  payload: {
    created: '2023-04-10T10:33:27.249Z',
    lastModified: '2023-04-10T10:33:27.249Z',
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

export const getCalendarContentfulWebhookDetail = ({
  revision = 1,
  googleCalendarId = 'calendar-1',
  associatedGoogleCalendarId = 'calendar-1',
  resourceId = null,
}: CalendarEventParams): WebhookDetail<
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
    revision,
    createdAt: '2023-04-10T10:33:27.249Z',
    updatedAt: '2023-04-10T10:33:27.249Z',
  },
  fields: {
    name: {
      'en-US': 'Tech 4a - iPSCs - 3D & Co-cultures',
    },
    googleCalendarId: {
      'en-US': googleCalendarId,
    },
    color: {
      'en-US': '#2952A3',
    },
    googleApiMetadata: {
      'en-US': {
        resourceId,
        associatedGoogleCalendarId,
      },
    },
  },
});

type CalendarEventParams = {
  revision?: number;
  googleCalendarId?: string;
  associatedGoogleCalendarId?: string | null;
  resourceId?: string | null;
};

export const getCalendarContentfulEvent = (
  params: CalendarEventParams,
): EventBridgeEvent<CalendarEvent, CalendarContentfulPayload> =>
  createEventBridgeEventMock(
    getCalendarContentfulWebhookDetail(params),
    'CalendarsPublished',
    'calendar-1',
  );

export const getCalendarFromDeliveryApi = ({
  revision = 1,
  associatedGoogleCalendarId = null,
  resourceId = null,
}: CalendarEventParams) => ({
  sys: {
    id: '1',
    revision,
  },
  fields: {
    googleApiMetadata: {
      resourceId,
      associatedGoogleCalendarId,
    },
  },
});
