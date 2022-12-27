import {
  FETCH_DASHBOARD,
  GraphQLClient,
  FetchDashboardQuery,
  FetchDashboardQueryVariables,
} from '@asap-hub/contentful';
import { DashboardDataObject } from '@asap-hub/model';
import { DashboardDataProvider } from '../dashboard.data-provider';
import { NewsItem, parseContentfulGraphQlNews } from './news.data-provider';
import { PageItem, parseContentfulGraphQlPages } from './pages.data-provider';

export class DashboardContentfulDataProvider implements DashboardDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetch(): Promise<DashboardDataObject> {
    const { dashboardCollection } = await this.contentfulClient.request<
      FetchDashboardQuery,
      FetchDashboardQueryVariables
    >(FETCH_DASHBOARD);
    const dashboard = dashboardCollection?.items[0];

    return {
      news:
        dashboard?.newsCollection?.items
          .filter((x): x is NewsItem => x !== null)
          .map(parseContentfulGraphQlNews) ?? [],
      pages:
        dashboard?.pagesCollection?.items
          .filter((x): x is PageItem => x !== null)
          .map(parseContentfulGraphQlPages) ?? [],
    };
  }
}
