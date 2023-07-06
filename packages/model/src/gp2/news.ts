import { ListResponse } from '../common';

const newsTypes = ['news', 'update'] as const;

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
