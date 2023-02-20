import { Document } from '@contentful/rich-text-types';
import { FetchOptions, ListResponse } from './common';

export type LinkEntry = {
  sys: {
    id: string;
  };
  __typename: string;
  url: string;
};

export type AssetBlock = {
  sys: {
    id: string;
  };
  url: string;
  description: string | null;
  contentType: string;
  width?: number;
  height?: number;
};

export type ContentfulNewsText = {
  json: Document;
  links: {
    entries: {
      inline: LinkEntry[];
      block: LinkEntry[];
    };
    assets: {
      block: AssetBlock[];
    };
  };
};

/* istanbul ignore next */
export const newsType = ['News', 'Tutorial'] as const;
export const newsFrequency = [
  'Biweekly Newsletter',
  'CRN Quarterly',
  'News Articles',
] as const;

export type NewsType = typeof newsType[number];
export type NewsFrequency = typeof newsFrequency[number];

export type NewsDataObject = {
  id: string;
  title: string;
  frequency?: NewsFrequency;
  shortText?: string;
  text?: string | ContentfulNewsText;
  thumbnail?: string;
  link?: string;
  linkText?: string;
  created: string;
};
export type ListNewsDataObject = ListResponse<NewsDataObject>;

export type NewsResponse = NewsDataObject;
export type ListNewsResponse = ListResponse<NewsResponse>;

export type FetchNewsFilter = {
  frequency?: NewsFrequency[];
};

export type FetchNewsOptions = FetchOptions<FetchNewsFilter>;
