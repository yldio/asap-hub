import { GoogleLegacyCalendarColor } from '@asap-hub/model';
import { Entity, Rest, RestPayload } from '../common';

interface Calendar {
  googleCalendarId: string;
  color: GoogleLegacyCalendarColor;
  name: string;
  syncToken?: string;
  resourceId?: string | null;
  expirationDate?: number;
}

export interface RestCalendar extends Entity, Rest<Calendar> {}

export interface InputCalendar extends Entity, RestPayload<Calendar> {}
