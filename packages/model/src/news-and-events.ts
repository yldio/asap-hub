import { ListResponse } from './common';

export type NewsAndEventsType = 'News' | 'Event' | 'Training';

export interface NewsOrEventResponse {
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

export type ListNewsAndEventsResponse = ListResponse<NewsOrEventResponse>;
