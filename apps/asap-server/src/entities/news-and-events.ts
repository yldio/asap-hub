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
    shortText: { iv: string };
    thumbnail: { iv: string[] };
    text: { iv: string };
    link?: { iv: string };
    linkText?: { iv: string };
  };
}

export const parse = (item: CMSNewsAndEvents): NewsAndEventsResponse => {
  return {
    id: item.id,
    created: parseDate(item.created).toISOString(),
    shortText: item.data.shortText?.iv,
    text: item.data.text?.iv,
    link: item.data.link?.iv,
    linkText: item.data.linkText?.iv,
    thumbnail:
      item.data.thumbnail &&
      createURL(
        item.data.thumbnail?.iv.map((t) => {
          // this handles thumbnails fetched with graphql
          const thumbnail = (t as unknown) as { id: string };
          if (thumbnail.id) {
            return thumbnail.id;
          }
          return t;
        }),
      )[0],
    title: item.data.title.iv,
    type: item.data.type.iv,
  } as NewsAndEventsResponse;
};
