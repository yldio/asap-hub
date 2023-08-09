import { FetchOptions, ListResponse } from '../common';

export const newsTypes = ['news', 'update'] as const;

export type NewsType = (typeof newsTypes)[number];

export type NewsDataObject = {
  id: string;
  created: string;
  title: string;
  shortText: string;
  link?: string;
  linkText?: string;
  type: NewsType;
};
export type ListNewsDataObject = ListResponse<NewsDataObject>;

export type NewsResponse = NewsDataObject;
export type ListNewsResponse = ListResponse<NewsResponse>;

export type FetchNewsFilter = {
  type?: NewsType[];
};

export type FetchNewsOptions = FetchOptions<FetchNewsFilter>;
