import { ListResponse } from './common';

export type PageDataObject = {
  id: string;
  path: string;
  title: string;
  shortText: string;
  text: string;
  link?: string;
  linkText?: string;
};

export type ListPageDataObject = ListResponse<PageDataObject>;

export type PageResponse = PageDataObject;
