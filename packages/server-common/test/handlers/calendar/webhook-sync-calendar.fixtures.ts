import { EventBridgeEvent } from 'aws-lambda';
import {
  ContentfulWebhookPayload,
  EntityMetaSysProps,
  SnapshotProps,
} from '@asap-hub/contentful';
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
  version = 1,
  calendarGoogleId = '3@group.calendar.google.com',
  calendarResourceId = 'resourceID',
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
    revision: version,
    createdAt: '2023-04-10T10:33:27.249Z',
    updatedAt: '2023-04-10T10:33:27.249Z',
  },
  fields: {
    name: {
      'en-US': 'Tech 4a - iPSCs - 3D & Co-cultures',
    },
    googleCalendarId: {
      'en-US': calendarGoogleId,
    },
    color: {
      'en-US': '#2952A3',
    },
    resourceId: {
      'en-US': calendarResourceId,
    },
  },
});

type CalendarEventParams = {
  version?: number;
  calendarGoogleId?: string;
  calendarResourceId?: string | null;
};

export const getCalendarContentfulEvent = (
  params: CalendarEventParams,
): EventBridgeEvent<CalendarEvent, CalendarContentfulPayload> =>
  createEventBridgeEventMock(
    getCalendarContentfulWebhookDetail(params),
    'CalendarsPublished',
    'calendar-1',
  );

export type CalendarSnapshot = SnapshotProps<
  { sys: EntityMetaSysProps } & {
    fields: {
      name: { 'en-US': string };
      googleCalendarId: { 'en-US': string };
      color: { 'en-US': string };
      resourceId?: { 'en-US': string | null };
    };
  }
>;

export const getCalendarSnapshot = ({
  version = 1,
  calendarGoogleId = '3@group.calendar.google.com',
  calendarResourceId = 'resourceID',
}: CalendarEventParams): CalendarSnapshot => ({
  sys: {
    type: 'Snapshot',
    snapshotType: 'publish',
    snapshotEntityType: 'Entry',
    id: '6Y83uGfyM54qiky0isFZzZ',
    createdAt: '2023-05-02T16:32:37.224Z',
    createdBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '2SHvngTJ24kxZGAPDJ8J1y',
      },
    },
    updatedAt: '2023-05-02T16:32:37.224Z',
    updatedBy: {
      sys: {
        type: 'Link',
        linkType: 'User',
        id: '2SHvngTJ24kxZGAPDJ8J1y',
      },
    },
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: '5v6w5j61tndm',
      },
    },
    version,
  },
  snapshot: {
    sys: {
      id: '4M0duBLkRuFOJbBv71VxIQ',
      type: 'Entry',
      createdAt: '2023-05-02T16:29:38.184Z',
      createdBy: {
        sys: {
          type: 'Link',
          linkType: 'User',
          id: '2SHvngTJ24kxZGAPDJ8J1y',
        },
      },
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: '5v6w5j61tndm',
        },
      },
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: 'calendars',
        },
      },
      version: version + 1,
      updatedAt: '2023-05-02T16:32:37.092Z',
      updatedBy: {
        sys: {
          type: 'Link',
          linkType: 'User',
          id: '2SHvngTJ24kxZGAPDJ8J1y',
        },
      },
      firstPublishedAt: '2023-05-02T16:31:22.015Z',
      publishedCounter: version,
      publishedAt: '2023-05-02T16:32:37.092Z',
      publishedBy: {
        sys: {
          type: 'Link',
          linkType: 'User',
          id: '2SHvngTJ24kxZGAPDJ8J1y',
        },
      },
      publishedVersion: version,
      environment: {
        sys: {
          id: 'master',
          type: 'Link',
          linkType: 'Environment',
        },
      },
    },
    fields: {
      name: {
        'en-US': 'ASAP Calendar',
      },
      googleCalendarId: {
        'en-US': calendarGoogleId,
      },
      color: {
        'en-US': '#5C1158',
      },
      resourceId: {
        'en-US': calendarResourceId,
      },
    },
  },
});

export const getCalendarSnapshots = () => ({
  items: [
    getCalendarSnapshot({
      version: 2,
      calendarGoogleId: '3@group.calendar.google.com',
      calendarResourceId: undefined,
    }),
    getCalendarSnapshot({
      version: 1,
      calendarGoogleId: '3@group.calendar.google.com',
      calendarResourceId: 'some-resource-id',
    }),
  ],
});
