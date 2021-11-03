import { NewsType, NewsResponse } from '@asap-hub/model';

export const createNewsResponse = (
  key: string,
  type: NewsType = 'News',
): NewsResponse => ({
  id: `uuid-${type}-${key}`,
  type,
  title: `${type} ${key} title`,
  shortText: `${type} ${key} short text`,
  text: `<h1>${type} ${key} text</h1>`,
  created: new Date().toISOString(),
});

export default createNewsResponse;
