import { GoogleLegacyCalendarColor } from '@asap-hub/model';
import { Rest, Entity, Graphql } from './common';

export interface Calendar {
  id: string;
  color: GoogleLegacyCalendarColor;
  name: string;
}

export interface RestCalendar extends Entity, Rest<Calendar> {}
export interface GraphqlCalendar extends Entity, Graphql<Calendar> {}
