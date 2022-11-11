import { NewsDataObject, NewsFrequency } from '@asap-hub/model';

import {
  GraphQLClient,
  parseRichText,
  FETCH_NEWS,
  FETCH_NEWS_BY_ID,
  FetchNewsByIdQuery,
  FetchNewsByIdQueryVariables,
  FetchNewsQuery,
  NewsOrder,
  FetchNewsQueryVariables,
} from '@asap-hub/contentful';

import { NewsDataProvider, FetchNewsProviderOptions } from '../types';

type NewsItem = NonNullable<
  NonNullable<FetchNewsQuery['newsCollection']>['items'][number]
>;

export class NewsContentfulDataProvider implements NewsDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetch(options?: FetchNewsProviderOptions) {
    const { newsCollection } = await this.contentfulClient.request<
      FetchNewsQuery,
      FetchNewsQueryVariables
    >(FETCH_NEWS, {
      limit: options?.take || null,
      skip: options?.skip || null,
      order: [NewsOrder.SysFirstPublishedAtDesc],
      where: {
        frequency_in: options?.filter?.frequency as string[],
        title_contains: options?.filter?.title || null,
      },
    });

    if (!newsCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: newsCollection?.total,
      items: newsCollection?.items
        .filter((x: NewsItem) => x !== null)
        .map(parseNews),
    };
  }

  async fetchById(id: string) {
    const { news } = await this.contentfulClient.request<
      FetchNewsByIdQuery,
      FetchNewsByIdQueryVariables
    >(FETCH_NEWS_BY_ID, { id });

    if (!news) {
      return null;
    }

    return parseNews(news);
  }
}

const parseNews = (item: NewsItem): NewsDataObject => ({
  // this case where id and title are null
  // should not happen but TS moans about it
  // because even required fields can be nullable
  // Read more in the link below
  // https://www.contentfulcommunity.com/t/why-do-required-fields-appear-as-nullable-in-the-graphql-graph/4079/4
  id: item.sys.id ?? '',
  title: item.title ?? '',
  type: 'News',
  frequency: (item.frequency as NewsFrequency) ?? undefined,
  shortText: item.shortText ?? undefined,
  thumbnail: item.thumbnail?.url ?? undefined,
  link: item.link ?? undefined,
  linkText: item.linkText ?? undefined,
  text: item.text ? parseRichText(item?.text.json) : undefined,
  created: item.sys.firstPublishedAt,
});
