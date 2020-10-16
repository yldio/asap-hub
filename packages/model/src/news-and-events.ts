import { ListResponse } from './common';

export interface NewsAndEventsResponse {
  id: string;
  title: string;
  type: 'News' | 'Event';
  subtitle?: string;
  thumbnail?: string;
  link?: {
    name?: string;
    href: string;
  };
  text?: string;
  created: string;
}

export type ListNewsAndEventsResponse = ListResponse<NewsAndEventsResponse>;
