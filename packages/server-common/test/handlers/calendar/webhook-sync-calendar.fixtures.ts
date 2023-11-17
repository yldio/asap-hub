import { ContentfulWebhookPayload } from '@asap-hub/contentful';
import {
  CalendarDataObject,
  CalendarEvent,
  WebhookDetail,
} from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';
import { CalendarContentfulPayload } from '../../../src';
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
  workingGroups: [{ id: '123', complete: false }],
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
