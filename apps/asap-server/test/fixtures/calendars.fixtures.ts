import { CalendarRaw } from '../../src/controllers/calendars';
import { CalendarResponse } from '@asap-hub/model';
import { Calendar, WebhookPayload } from '@asap-hub/squidex';
import { Rest } from '@asap-hub/squidex/src/entities/common';

export const calendarRaw: CalendarRaw = {
  id: 'uuid',
  color: '#2952A3',
  name: 'Tech 4a - iPSCs - 3D & Co-cultures',
  syncToken: 'sync-token',
  resourceId: 'resource-id',
  expirationDate: 1617196357000,
  googleCalendarId: '3@group.calendar.google.com',
};

export const getCalendarResponse = (): CalendarResponse => ({
  id: 'calendar-id-1',
  color: '#5C1158',
  name: 'Kubernetes Meetups',
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
    },
  });

const getRestCalendar = (): Rest<Calendar> => ({
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
});
