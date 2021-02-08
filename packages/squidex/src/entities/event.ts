import { Rest, Entity, Graphql } from './common';
import { GraphqlCalendar } from './calendar';

type GoogleEventStatus = 'confirmed' | 'tentative' | 'cancelled';

interface Event<TCalendar = string> {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: GoogleEventStatus;
  eventLink: string;
  meetingLink?: string;
  calendar: TCalendar[];
  tags: string[];
}

export interface RestEvent extends Entity, Rest<Event> {}
export interface GraphqlEvent extends Entity, Graphql<Event<GraphqlCalendar>> {}
