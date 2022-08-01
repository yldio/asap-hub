import { Rest, Entity, Graphql } from '../common';

export type NewsType = 'News' | 'Event' | 'Training';

export interface News<TThumbnail = string> {
  type: NewsType;
  title: string;
  shortText: string;
  thumbnail: TThumbnail[];
  text: string;
  link?: string;
  linkText?: string;
}

export interface RestNews extends Entity, Rest<News> {}
export interface GraphqlNews extends Entity, Graphql<News<{ id: string }>> {}
