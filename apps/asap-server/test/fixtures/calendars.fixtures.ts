import { CalendarRaw } from '../../src/controllers/calendars';
import { CalendarResponse } from '@asap-hub/model';
import {
  Calendar,
  RestCalendar,
  Results,
  WebhookPayload,
} from '@asap-hub/squidex';
import { FetchCalendarQuery } from '../../src/gql/graphql';

export const getCalendarRaw = (): CalendarRaw => ({
  id: 'cc5f74e0-c611-4043-abde-cd3c0d5a3414',
  color: '#2952A3',
  name: 'Tech 4a - iPSCs - 3D & Co-cultures',
  syncToken: 'sync-token',
  resourceId: 'resource-id',
  expirationDate: 1617196357000,
  googleCalendarId: '3@group.calendar.google.com',
  version: 42,
});

export const getCalendarResponse = (): CalendarResponse => ({
  id: '3@group.calendar.google.com',
  color: '#2952A3',
  name: 'Tech 4a - iPSCs - 3D & Co-cultures',
});

export const getCalendarUpdatedWebhookEvent = (): WebhookPayload<Calendar> => ({
  type: 'CalendarsUpdated',
  timestamp: '2021-02-15T13:11:25Z',
  payload: {
    $type: 'EnrichedContentEvent',
    type: 'Updated',
    id: 'b57f3aed-9f07-49a6-a1c7-cc4948a3764f',
    created: '2021-01-25T13:59:34Z',
    lastModified: '2021-08-24T16:02:11Z',
    createdBy: 'subject:5ff5f26d7c171c647fd68bb4',
    lastModifiedBy: 'client:asap-hub:default',
    data: getRestCalendar().data,
    version: 42,
  },
});

export const getCalendarPublishedWebhookEvent =
  (): WebhookPayload<Calendar> => ({
    type: 'CalendarsPublished',
    timestamp: '2021-02-15T13:11:25Z',
    payload: {
      $type: 'EnrichedContentEvent',
      type: 'Updated',
      id: 'b57f3aed-9f07-49a6-a1c7-cc4948a3764f',
      created: '2021-01-25T13:59:34Z',
      lastModified: '2021-08-24T16:02:11Z',
      createdBy: 'subject:5ff5f26d7c171c647fd68bb4',
      lastModifiedBy: 'client:asap-hub:default',
      data: getRestCalendar().data,
      version: 42,
    },
  });

export const getRestCalendar = (): RestCalendar => ({
  id: 'cms-calendar-id-1',
  data: {
    name: {
      iv: 'Tech 3 - Structural Biology',
    },
    googleCalendarId: {
      iv: 'c_v8ma9lsbsjf90rk30ougr54iig@group.calendar.google.com',
    },
    color: {
      iv: '#4E5D6C',
    },
    syncToken: {
      iv: '9a8s9d8as9d=',
    },
    resourceId: {
      iv: 'a8sd9a8sd9a',
    },
    expirationDate: {
      iv: 1631667628000,
    },
  },
  created: '2021-01-07T16:44:09Z',
  lastModified: '2021-01-07T16:44:09Z',
  version: 42,
});

export const getCalendarsRestResponse = (): Results<RestCalendar> => ({
  total: 2,
  items: [
    {
      id: 'cms-calendar-id-1',
      data: {
        googleCalendarId: { iv: 'calendar-id-1' },
        color: { iv: '#5C1158' },
        name: { iv: 'Kubernetes Meetups' },
        resourceId: { iv: 'resource-id' },
        syncToken: { iv: 'sync-token' },
        expirationDate: { iv: 1614697798681 },
      },
      created: '2021-01-07T16:44:09Z',
      lastModified: '2021-01-07T16:44:09Z',
      version: 42,
    },
    {
      id: 'cms-calendar-id-2',
      data: {
        googleCalendarId: { iv: 'calendar-id-2' },
        color: { iv: '#B1365F' },
        name: { iv: 'Service Mesh Conferences' },
        resourceId: { iv: 'resource-id-2' },
        syncToken: { iv: 'sync-token-2' },
        expirationDate: { iv: 1614697621081 },
      },
      created: '2021-01-07T16:44:09Z',
      lastModified: '2021-01-07T16:44:09Z',
      version: 42,
    },
  ],
});

export const getCalendarsGraphqlResponse = (): {
  data: NonNullable<FetchCalendarQuery>;
} => ({
  data: {
    findCalendarsContent: {
      id: 'cc5f74e0-c611-4043-abde-cd3c0d5a3414',
      created: '2021-01-07T16:44:09Z',
      lastModified: '2021-01-07T16:44:09Z',
      version: 42,
      flatData: {
        googleCalendarId: '3@group.calendar.google.com',
        color: '#2952A3',
        name: 'Tech 4a - iPSCs - 3D & Co-cultures',
        resourceId: 'resource-id',
        syncToken: 'sync-token',
        expirationDate: 1617196357000,
      },
    },
  },
});

export const getSquidexGraphqlCalendars = () => ({
  id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
  created: '2020-09-23T16:34:26.842Z',
  lastModified: '2021-05-14T14:48:46Z',
  version: 42,
  flatData: squidexGraphqlCalendarsFlatData(),
});

const squidexGraphqlCalendarsFlatData = () => ({
  googleCalendarId: '3@group.calendar.google.com',
  color: '#2952A3',
  name: 'Tech 4a - iPSCs - 3D & Co-cultures',
  resourceId: 'resource-id',
  syncToken: 'sync-token',
  expirationDate: 1617196357000,
});

export const squidexGraphqlCalendarsResponse = () => ({
  color: '#2952A3',
  id: '3@group.calendar.google.com',
  name: 'Tech 4a - iPSCs - 3D & Co-cultures',
});
