import { NewsOrEventResponse, NewsAndEventsType } from '@asap-hub/model';
import { GraphqlNewsOrEvent } from '@asap-hub/squidex';
import { parseDate, createURL } from '../utils/squidex';

export interface CMSNewsAndEvents {
  id: string;
  created: string;
  data: {
    type: {
      iv: NewsAndEventsType;
    };
    title: { iv: string };
    shortText: { iv: string };
    thumbnail: { iv: ({ id: string } | string)[] };
    text: { iv: string };
    link?: { iv: string };
    linkText?: { iv: string };
  };
}

export interface CMSGraphQLNewsAndEvents {
  id: string;
  created: string;
  flatData: {
    type: NewsAndEventsType;
    title: string;
    shortText: string;
    thumbnail: {
      id: string;
    }[];
    text: string;
    link?: string;
    linkText?: string;
  };
}

export const parseNewsAndEvents = (
  item: CMSNewsAndEvents,
): NewsOrEventResponse => {
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
          if (typeof t === 'string') {
            return t as string;
          }
          return t.id;
        }),
      )[0],
    title: item.data.title.iv,
    type: item.data.type.iv,
  } as NewsOrEventResponse;
};

export const parseGraphQLNewsAndEvents = (
  item: GraphqlNewsOrEvent,
): NewsOrEventResponse => {
  const createdDate = parseDate(item.created).toISOString();
  return {
    id: item.id,
    created: createdDate,
    title: item.flatData?.title || '',
    shortText: item.flatData?.shortText || '',
    text: item.flatData?.text || undefined,
    link: item.flatData?.link || undefined,
    linkText: item.flatData?.linkText || undefined,
    type: item.flatData?.type || 'News',
    thumbnail: item.flatData?.thumbnail
      ? createURL(item.flatData.thumbnail.map((t) => t.id))[0]
      : undefined,
  };
};
