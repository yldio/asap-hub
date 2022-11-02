import { NewsFrequency } from '@asap-hub/model';
import { Document } from '@contentful/rich-text-types';
import {
  Asset,
  EntryWithLinkResolutionAndWithUnresolvableLinks,
} from 'contentful';

export interface NewsEntity {
  id: string;
  title: string;
  shortText?: string;
  frequency: NewsFrequency;
  thumbnail?: Asset;
  text?: Document;
  link?: string;
  linkText?: string;
}

export type ContentfulRestNews =
  EntryWithLinkResolutionAndWithUnresolvableLinks<NewsEntity>;
