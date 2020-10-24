import { ListResponse } from './common';

export interface NewsAndEventsResponse {
  id: string;
  title: string;
  type: 'News' | 'Event';
  shortText?: string;
  text?: string;
  thumbnail?: string;
  link?: string;
  linkText?: string;
  created: string;
}

export type ListNewsAndEventsResponse = ListResponse<NewsAndEventsResponse>;
