import { Rest, Entity, Graphql } from './common';

export type NewsOrEventType = 'News' | 'Event' | 'Training';

interface NewsOrEvent<TThumbnail = string> {
  type: NewsOrEventType;
  title: string;
  shortText: string;
  thumbnail: TThumbnail[];
  text: string;
  link?: string;
  linkText?: string;
}

export interface RestNewsOrEvent extends Entity, Rest<NewsOrEvent> {}
export interface GraphqlNewsOrEvent
  extends Entity,
    Graphql<NewsOrEvent<{ id: string }>> {}
