import { gp2 as gp2Model } from '@asap-hub/model';

import { gp2 as gp2Contentful, GraphQLClient } from '@asap-hub/contentful';

import { DashboardDataProvider } from '../types';

export type DashboardStats = NonNullable<
  NonNullable<gp2Contentful.Query['latestStatsCollection']>['items'][number]
>;

export class DashboardContentfulDataProvider implements DashboardDataProvider {
  constructor(private graphQLClient: GraphQLClient) {}

  async fetch() {
    const { latestStatsCollection } =
      await this.graphQLClient.request<gp2Contentful.FetchLatestStatsQuery>(
        gp2Contentful.FETCH_STATS,
      );

    if (!latestStatsCollection?.items) {
      return { total: 0, items: [] };
    }

    return {
      total: latestStatsCollection.items.length,
      items: latestStatsCollection.items
        .filter((stats): stats is DashboardStats => stats !== null)
        .map(parseContentfulGraphQlStats),
    };
  }

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }
}

export const parseContentfulGraphQlStats = (
  item: DashboardStats,
): gp2Model.DashboardDataObject => ({
  // Every field in Contentful is marked as nullable even when its required
  // this is because Contentful use the same schema for preview and production
  // Read more in the link below
  // https://www.contentfulcommunity.com/t/why-do-required-fields-appear-as-nullable-in-the-graphql-graph/4079/4
  sampleCount: item.sampleCount ?? 0,
  articleCount: item.articleCount ?? 0,
  cohortCount: item.cohortCount ?? 0,
});
