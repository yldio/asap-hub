import { CalendarRaw } from '../../src/controllers/calendars';
import { CalendarResponse } from '@asap-hub/model';

export const calendarRaw: CalendarRaw = {
  id: 'uuid',
  color: '#2952A3',
  name: 'Tech 4a - iPSCs - 3D & Co-cultures',
  syncToken: 'sync-token',
  resourceId: 'resource-id',
  expirationDate: 1617196357000,
  googleCalendarId: '3@group.calendar.google.com',
};

export const calendarResponse: CalendarResponse = {
  id: 'calendar-id-1',
  color: '#5C1158',
  name: 'Kubernetes Meetups',
};
