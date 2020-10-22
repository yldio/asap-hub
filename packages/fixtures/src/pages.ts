import { PageResponse } from '@asap-hub/model';

export const createPageResponse = (key: string): PageResponse => ({
  id: `uuid-${key}`,
  path: `/${key}`,
  title: `Page ${key} title`,
  shortText: `Page ${key} short text`,
  text: `<h1>Page ${key} text</h1>`,
});

export default createPageResponse;
