import { NewsOrEventResponse } from '@asap-hub/model';

export const createNewsAndEventsResponse = (
  key: string,
): NewsOrEventResponse => ({
  id: `uuid-${key}`,
  type: 'News',
  title: `News ${key} title`,
  shortText: `News ${key} short text`,
  text: `<h1>News ${key} text</h1>`,
  created: new Date().toISOString(),
});

export default createNewsAndEventsResponse;
