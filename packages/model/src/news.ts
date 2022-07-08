import { ListResponse } from './common';

export const newsType = ['News', 'Event', 'Training', 'Tutorial'] as const;

export type NewsType = typeof newsType[number];

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
