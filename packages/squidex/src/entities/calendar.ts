import { Rest, Entity, Graphql } from './common';
import { GoogleLegacyCalendarColor } from '@asap-hub/model'

interface Calendar {
  id: string;
  color: GoogleLegacyCalendarColor;
  name: string;
}

export interface RestCalendar extends Entity, Rest<Calendar> {}
export interface GraphqlCalendar extends Entity, Graphql<Calendar> {}
