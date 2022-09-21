import { NewsFrequency, NewsType } from '@asap-hub/model';
import { Rest, Entity, Graphql } from '../common';

export interface News<TThumbnail = string> {
  type: NewsType;
  title: string;
  shortText: string;
  thumbnail: TThumbnail[];
  text: string;
  frequency?: NewsFrequency;
  link?: string;
  linkText?: string;
}

export interface RestNews extends Entity, Rest<News> {}
export interface GraphqlNews extends Entity, Graphql<News<{ id: string }>> {}
