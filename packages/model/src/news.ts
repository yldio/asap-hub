import { ListResponse } from './common';

export type NewsType = 'News' | 'Event' | 'Training';

export interface NewsResponse {
  id: string;
  title: string;
  type: NewsType;
  shortText?: string;
  text?: string;
  thumbnail?: string;
  link?: string;
  linkText?: string;
  created: string;
}

export type ListNewsResponse = ListResponse<NewsResponse>;
