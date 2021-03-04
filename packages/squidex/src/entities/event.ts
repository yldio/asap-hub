import { EventStatus } from '@asap-hub/model';
import { Rest, Entity, Graphql } from './common';
import { GraphqlCalendar } from './calendar';

type GoogleEventStatus = EventStatus;

export interface Event<TCalendar = string, TThumbnail = string> {
  googleId: string;
  title: string;
  description?: string;
  startDate: string;
  startDateTimeZone: string;
  endDate: string;
  endDateTimeZone: string;
  status: GoogleEventStatus;
  notes?: string;
  videoRecording?: string;
  presentation?: string;
  meetingMaterials?: {
    title: string;
    url: string;
    label?: string;
  }[];
  meetingLink?: string;
  thumbnail?: TThumbnail[];
  calendar: TCalendar[];
  tags: string[];
  hidden: boolean;
}

export interface RestEvent extends Entity, Rest<Event> {}
export interface GraphqlEvent
  extends Entity,
    Graphql<Event<GraphqlCalendar, Entity>> {}
