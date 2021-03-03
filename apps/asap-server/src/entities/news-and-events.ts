import { NewsOrEventResponse } from '@asap-hub/model';
import { GraphqlNewsOrEvent, RestNewsOrEvent } from '@asap-hub/squidex';
import { parseDate, createURL } from '../utils/squidex';

export const parseNewsAndEvents = (
  item: RestNewsOrEvent,
): NewsOrEventResponse =>
  ({
    id: item.id,
    created: parseDate(item.created).toISOString(),
    shortText: item.data.shortText?.iv,
    text: item.data.text?.iv,
    link: item.data.link?.iv,
    linkText: item.data.linkText?.iv,
    thumbnail: item.data.thumbnail && createURL(item.data.thumbnail?.iv)[0],
    title: item.data.title.iv,
    type: item.data.type.iv,
  } as NewsOrEventResponse);

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
    thumbnail: item.flatData?.thumbnail?.length
      ? createURL(item.flatData.thumbnail.map((t) => t.id))[0]
      : undefined,
  };
};
