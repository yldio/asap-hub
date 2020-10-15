import { NewsAndEventsResponse } from '@asap-hub/model';
import { parseDate, createURL } from '../utils/squidex';

export interface CMSNewsAndEvents {
  id: string;
  created: string;
  data: {
    type: {
      iv: 'News' | 'Event';
    };
    title: { iv: string };
    subtitle: { iv: string };
    thumbnail: { iv: string[] };
    text: { iv: string };
  };
}

export const parse = (item: CMSNewsAndEvents): NewsAndEventsResponse => {
  return {
    id: item.id,
    created: parseDate(item.created).toISOString(),
    subtitle: item.data.subtitle?.iv,
    text: item.data.text?.iv,
    thumbnail: item.data.thumbnail && createURL(item.data.thumbnail?.iv)[0],
    title: item.data.title.iv,
    type: item.data.type.iv,
  } as NewsAndEventsResponse;
};
