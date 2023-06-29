import { gp2 as gp2Model } from '@asap-hub/model';

import { gp2 as gp2Contentful, GraphQLClient } from '@asap-hub/contentful';

import { DashboardDataProvider } from '../types';
import { parseAnnouncements } from './utils';

export type Dashboard = NonNullable<
  NonNullable<gp2Contentful.Query['dashboardCollection']>['items'][number]
>;

export class DashboardContentfulDataProvider implements DashboardDataProvider {
  constructor(private graphQLClient: GraphQLClient) {}

  async fetch(options: gp2Model.FetchDashboardOptions) {
    const { sortBy, sortOrder } = options;

    const getOrderFilter = () => {
      if (sortBy === 'deadline') {
        if (sortOrder === 'asc')
          return gp2Contentful.DashboardAnnouncementsCollectionOrder
            .DeadlineAsc;
        if (sortOrder === 'desc')
          return gp2Contentful.DashboardAnnouncementsCollectionOrder
            .DeadlineDesc;
      }

      if (sortBy === 'created') {
        if (sortOrder === 'asc')
          return gp2Contentful.DashboardAnnouncementsCollectionOrder
            .SysPublishedAtAsc;
        if (sortOrder === 'desc')
          return gp2Contentful.DashboardAnnouncementsCollectionOrder
            .SysPublishedAtDesc;
      }

      return undefined;
    };

    const { dashboardCollection } = await this.graphQLClient.request<
      gp2Contentful.FetchDashboardQuery,
      gp2Contentful.FetchDashboardQueryVariables
    >(gp2Contentful.FETCH_DASHBOARD, {
      orderAnnouncements: getOrderFilter(),
    });

    if (!dashboardCollection?.items) {
      return { total: 0, items: [] };
    }

    return {
      total: dashboardCollection.items.length,
      items: dashboardCollection.items
        .filter((dashboard): dashboard is Dashboard => dashboard !== null)
        .map(parseContentfulGraphQlDashboard),
    };
  }

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }
}

export const parseContentfulGraphQlDashboard = (
  item: Dashboard,
): gp2Model.DashboardDataObject => ({
  // Every field in Contentful is marked as nullable even when its required
  // this is because Contentful use the same schema for preview and production
  // Read more in the link below
  // https://www.contentfulcommunity.com/t/why-do-required-fields-appear-as-nullable-in-the-graphql-graph/4079/4
  latestStats: {
    sampleCount: item.latestStats?.sampleCount ?? 0,
    articleCount: item.latestStats?.articleCount ?? 0,
    cohortCount: item.latestStats?.cohortCount ?? 0,
  },
  announcements: parseAnnouncements(item.announcementsCollection),
});
