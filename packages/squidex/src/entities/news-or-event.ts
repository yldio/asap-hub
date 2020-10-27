import { Rest, Entity, Graphql } from './common';

export type NewsOrEventType = 'News' | 'Event' | 'Training';

interface NewsOrEvent {
  type: NewsOrEventType;
  title: string;
  shortText: string;
  thumbnail: {
    id: string;
  }[];
  text: string;
  link?: string;
  linkText?: string;
}

export interface RestNewsOrEvent extends Entity, Rest<NewsOrEvent> {}
export interface GraphqlNewsOrEvent extends Entity, Graphql<NewsOrEvent> {}
