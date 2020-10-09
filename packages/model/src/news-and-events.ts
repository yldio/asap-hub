import { ListResponse } from './common';

export interface NewsAndEventsResponse {
  id: string;
  title: string;
  type: 'News' | 'Event';
  subtitle?: string;
  thumbnail?: string;
  text?: string;
  created: Date;
}

export type ListNewsAndEventsResponse = ListResponse<NewsAndEventsResponse>;
