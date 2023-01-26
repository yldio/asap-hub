import { ListResponse } from '../common';

export type NewsDataObject = {
  id: string;
  created: string;
  title: string;
  text: string;
  link?: string;
  linkText?: string;
  sampleCount: number;
  articleCount: number;
  cohortCount: number;
};
export type ListNewsDataObject = ListResponse<NewsDataObject>;

export type NewsResponse = NewsDataObject;
export type ListNewsResponse = ListResponse<NewsResponse>;
