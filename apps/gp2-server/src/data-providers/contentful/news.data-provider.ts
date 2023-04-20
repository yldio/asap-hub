import { gp2 as gp2Model } from '@asap-hub/model';

import { gp2 as gp2Contentful, GraphQLClient } from '@asap-hub/contentful';

import { FetchNewsProviderOptions, NewsDataProvider } from '../types';

export type NewsItem = NonNullable<
  NonNullable<gp2Contentful.FetchNewsQuery['newsCollection']>['items'][number]
>;

export class NewsContentfulDataProvider implements NewsDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetch(options?: FetchNewsProviderOptions) {
    const { newsCollection } = await this.contentfulClient.request<
      gp2Contentful.FetchNewsQuery,
      gp2Contentful.FetchNewsQueryVariables
    >(gp2Contentful.FETCH_NEWS, {
      limit: options?.take || null,
      skip: options?.skip || null,
      order: [gp2Contentful.NewsOrder.PublishDateDesc],
      where: {
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
        .filter((x): x is NewsItem => x !== null)
        .map(parseContentfulGraphQlNews),
    };
  }

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }
}

export const parseContentfulGraphQlNews = (
  item: NewsItem,
): gp2Model.NewsDataObject => ({
  // Every field in Contentful is marked as nullable even when its required
  // this is because Contentful use the same schema for preview and production
  // Read more in the link below
  // https://www.contentfulcommunity.com/t/why-do-required-fields-appear-as-nullable-in-the-graphql-graph/4079/4
  id: item.sys.id ?? '',
  title: item.title ?? '',
  shortText: item.shortText ?? '',
  sampleCount: item.sampleCount ?? 0,
  articleCount: item.articleCount ?? 0,
  cohortCount: item.cohortCount ?? 0,
  link: item.link ?? undefined,
  linkText: item.linkText ?? undefined,
  created: item.publishDate,
});
