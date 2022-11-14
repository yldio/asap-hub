import { Document } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

export const parseRichText = (document: Document) =>
  documentToHtmlString(document);
