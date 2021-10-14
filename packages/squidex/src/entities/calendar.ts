import { GoogleLegacyCalendarColor } from '@asap-hub/model';
import { Rest, Entity } from './common';

export interface Calendar {
  googleCalendarId: string;
  color: GoogleLegacyCalendarColor;
  name: string;
  syncToken?: string;
  resourceId?: string | null;
  expirationDate?: number;
}

export interface RestCalendar extends Entity, Rest<Calendar> {}
