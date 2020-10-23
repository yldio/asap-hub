import { ListResponse } from './common';

export type NewsAndEventsType = 'News' | 'Event' | 'Training';

export interface NewsAndEventsResponse {
  id: string;
  title: string;
  type: NewsAndEventsType;
  shortText?: string;
  text?: string;
  thumbnail?: string;
  link?: string;
  linkText?: string;
  created: string;
}

export type ListNewsAndEventsResponse = ListResponse<NewsAndEventsResponse>;
