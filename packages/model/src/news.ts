import { FetchOptions, ListResponse } from './common';

/* istanbul ignore next */
export const newsType = ['News', 'Tutorial'] as const;
export const newsFrequency = [
  'Biweekly Newsletter',
  'CRN Quarterly',
  'News Articles',
] as const;

export type NewsType = (typeof newsType)[number];
export type NewsFrequency = (typeof newsFrequency)[number];

export type NewsDataObject = {
  id: string;
  title: string;
  frequency?: NewsFrequency;
  shortText?: string;
  text?: string;
  thumbnail?: string;
  link?: string;
  linkText?: string;
  created: string;
  tags: string[];
};
export type ListNewsDataObject = ListResponse<NewsDataObject>;

export type NewsResponse = NewsDataObject;
export type ListNewsResponse = ListResponse<NewsResponse>;

export type FetchNewsFilter = {
  frequency?: NewsFrequency[];
};

export type FetchNewsOptions = FetchOptions<FetchNewsFilter>;
