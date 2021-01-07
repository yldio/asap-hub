import { Rest, Entity, Graphql } from './common';

interface Calendar {
  id: string;
  color: string;
  name: string;
}

export interface RestCalendar extends Entity, Rest<Calendar> {}
export interface GraphqlCalendar extends Entity, Graphql<Calendar> {}
