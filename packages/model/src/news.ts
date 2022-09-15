import { ListResponse } from './common';

/* istanbul ignore next */
export const newsType = ['News', 'Tutorial', 'Working Groups'] as const;
export const newsFrequency = [
  'Biweekly Newsletter',
  'CRN Quarterly',
  'News Articles',
] as const;

export type NewsType = typeof newsType[number];
export type NewsFrequency = typeof newsFrequency[number];

export interface NewsResponse {
  id: string;
  title: string;
  type: NewsType;
  frequency?: NewsFrequency;
  shortText?: string;
  text?: string;
  thumbnail?: string;
  link?: string;
  linkText?: string;
  created: string;
}
export type ListNewsResponse = ListResponse<NewsResponse>;
