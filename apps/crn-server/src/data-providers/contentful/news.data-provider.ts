import { NewsDataObject, NewsFrequency } from '@asap-hub/model';

import {
  GraphQLClient,
  parseRichText,
  FETCH_NEWS,
  FETCH_NEWS_BY_ID,
  FetchNewsByIdQuery,
  FetchNewsByIdQueryVariables,
  FetchNewsQuery,
  FetchNewsQueryVariables,
} from '@asap-hub/contentful';

import { FetchNewsProviderOptions } from '../types';

type NewsItem = NonNullable<
  NonNullable<FetchNewsQuery['newsCollection']>['items'][number]
>;

export class NewsContentfulDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetch(options?: FetchNewsProviderOptions) {
    const { newsCollection } = await this.contentfulClient.request<
      FetchNewsQuery,
      FetchNewsQueryVariables
    >(FETCH_NEWS, {
      limit: options?.take || null,
      skip: options?.skip || null,
      frequency: options?.filter?.frequency || null,
      title: options?.filter?.title || null,
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
        .filter((x): x is NewsItem => x !== null)
        .map(parseNews),
    };
  }

  async fetchById(id: string) {
    const { newsCollection } = await this.contentfulClient.request<
      FetchNewsByIdQuery,
      FetchNewsByIdQueryVariables
    >(FETCH_NEWS_BY_ID, { id });
    const news = newsCollection?.items;

    if (!news || !news[0]) {
      return null;
    }

    return parseNews(news[0]);
  }
}

const parseNews = (item: NewsItem): NewsDataObject => ({
  // this case where id and title are null
  // should not happen but TS moans about it
  // because even required fields can be nullable
  // Read more in the link below
  // https://www.contentfulcommunity.com/t/why-do-required-fields-appear-as-nullable-in-the-graphql-graph/4079/4
  id: item.id ?? '',
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
