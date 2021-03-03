import { EventStatus } from '@asap-hub/model';
import { Rest, Entity, Graphql } from './common';
import { GraphqlCalendar } from './calendar';

type GoogleEventStatus = EventStatus;

export interface Event<TCalendar = string, TThumbnail = string> {
  title: string;
  description?: string;
  startDate: string;
  startDateTimeZone: string;
  endDate: string;
  endDateTimeZone: string;
  status: GoogleEventStatus;
  meetingLink?: string;
  thumbnail?: TThumbnail[];
  calendar: TCalendar[];
  tags: string[];
}

export interface RestEvent extends Entity, Rest<Event> {}
export interface GraphqlEvent
  extends Entity,
    Graphql<Event<GraphqlCalendar, Entity>> {}
