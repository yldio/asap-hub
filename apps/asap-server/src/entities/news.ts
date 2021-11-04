import { NewsResponse } from '@asap-hub/model';
import { GraphqlNews, RestNews } from '@asap-hub/squidex';
import { parseDate, createURL } from '../utils/squidex';

export const parseNews = (item: RestNews): NewsResponse => ({
  id: item.id,
  created: parseDate(item.created).toISOString(),
  shortText: item.data.shortText?.iv,
  text: item.data.text?.iv,
  link: item.data.link?.iv,
  linkText: item.data.linkText?.iv,
  thumbnail: item.data.thumbnail?.iv
    ? createURL(item.data.thumbnail.iv)[0]
    : undefined,
  title: item.data.title.iv,
  type: item.data.type.iv,
});

export const parseGraphQLNews = (item: GraphqlNews): NewsResponse => {
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
