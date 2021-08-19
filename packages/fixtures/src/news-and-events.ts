import { NewsAndEventsType, NewsOrEventResponse } from '@asap-hub/model';

export const createNewsAndEventsResponse = (
  key: string,
  responseType: NewsAndEventsType = 'News',
): NewsOrEventResponse => ({
  id: `uuid-${key}`,
  type: responseType,
  title: `News ${key} title`,
  shortText: `News ${key} short text`,
  text: `<h1>News ${key} text</h1>`,
  created: new Date().toISOString(),
});

export default createNewsAndEventsResponse;
