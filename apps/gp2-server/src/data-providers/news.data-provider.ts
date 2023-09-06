import { gp2 as gp2Model } from '@asap-hub/model';

import { gp2 as gp2Contentful, GraphQLClient } from '@asap-hub/contentful';

import { NewsDataProvider } from './types';

export type NewsItem = NonNullable<
  NonNullable<gp2Contentful.FetchNewsQuery['newsCollection']>['items'][number]
>;

export class NewsContentfulDataProvider implements NewsDataProvider {
  constructor(private graphQLClient: GraphQLClient) {}

  async fetch(options?: gp2Model.FetchNewsOptions) {
    const { newsCollection } = await this.graphQLClient.request<
      gp2Contentful.FetchNewsQuery,
      gp2Contentful.FetchNewsQueryVariables
    >(gp2Contentful.FETCH_NEWS, {
      limit: options?.take || null,
      skip: options?.skip || null,
      order: [gp2Contentful.NewsOrder.PublishDateDesc],
      where: {
        type_in: options?.filter?.type as string[],
        title_contains: options?.search || null,
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
        .filter((news): news is NewsItem => news !== null)
        .map(parseGraphQlNews),
    };
  }

  async fetchById(id: string): Promise<gp2Model.NewsDataObject | null> {
    const { news } = await this.graphQLClient.request<
      gp2Contentful.FetchNewsByIdQuery,
      gp2Contentful.FetchNewsByIdQueryVariables
    >(gp2Contentful.FETCH_NEWS_BY_ID, { id });
    return news ? parseGraphQlNews(news) : null;
  }
}

export const parseGraphQlNews = (item: NewsItem): gp2Model.NewsDataObject => ({
  // Every field in Contentful is marked as nullable even when its required
  // this is because Contentful use the same schema for preview and production
  // Read more in the link below
  // https://www.contentfulcommunity.com/t/why-do-required-fields-appear-as-nullable-in-the-graphql-graph/4079/4
  id: item.sys.id ?? '',
  title: item.title ?? '',
  shortText: item.shortText ?? '',
  link: item.link ?? undefined,
  linkText: item.linkText ?? undefined,
  created: item.publishDate,
  type: item.type as gp2Model.NewsType,
});
