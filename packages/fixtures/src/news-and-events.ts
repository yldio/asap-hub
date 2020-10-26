import { NewsAndEventsResponse } from '@asap-hub/model';

export const createNewsAndEventsResponse = (
  key: string,
): NewsAndEventsResponse => ({
  id: `uuid-${key}`,
  type: 'News',
  title: `News ${key} title`,
  shortText: `News ${key} short text`,
  text: `<h1>News ${key} text</h1>`,
  created: new Date().toISOString(),
});

export default createNewsAndEventsResponse;
