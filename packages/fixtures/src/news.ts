import { NewsType, NewsResponse, NewsFrequency } from '@asap-hub/model';

export const createNewsResponse = (
  key: string | number,
  type: NewsType = 'News',
  frequency: NewsFrequency,
): NewsResponse => ({
  id: `uuid-${type}-${key}`,
  type,
  title: `${type} ${key} title`,
  shortText: `${type} ${key} short text`,
  text: `<h1>${type} ${key} text</h1>`,
  created: new Date().toISOString(),
  frequency,
});

export default createNewsResponse;
