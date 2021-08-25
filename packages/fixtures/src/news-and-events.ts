import { NewsAndEventsType, NewsOrEventResponse } from '@asap-hub/model';

export const createNewsAndEventsResponse = (
  key: string,
  type: NewsAndEventsType = 'News',
): NewsOrEventResponse => ({
  id: `uuid-${type}-${key}`,
  type,
  title: `${type} ${key} title`,
  shortText: `${type} ${key} short text`,
  text: `<h1>${type} ${key} text</h1>`,
  created: new Date().toISOString(),
});

export default createNewsAndEventsResponse;
