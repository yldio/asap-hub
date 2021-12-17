import { DashboardResponse } from '@asap-hub/model';
import { SquidexGraphqlClient } from '@asap-hub/squidex';

import { parseGraphQLPage, parseGraphQLNews } from '../entities';
import { FETCH_DASHBOARD } from '../queries/dashboard.queries';
import { FetchDashboardQuery } from '../gql/graphql';

export interface DashboardController {
  fetch: () => Promise<DashboardResponse>;
}

export default class Dashboard {
  squidexGraphqlClient: SquidexGraphqlClient;

  constructor(squidexGraphqlClient: SquidexGraphqlClient) {
    this.squidexGraphqlClient = squidexGraphqlClient;
  }

  async fetch(): Promise<DashboardResponse> {
    const { queryDashboardContents } = await this.squidexGraphqlClient.request<
      FetchDashboardQuery,
      unknown
    >(FETCH_DASHBOARD);
    if (
      !queryDashboardContents ||
      queryDashboardContents.length === 0 ||
      !queryDashboardContents[0]
    ) {
      return {
        news: [],
        pages: [],
      };
    }

    const [{ flatData }] = queryDashboardContents;
    return {
      news: flatData.news?.map(parseGraphQLNews) ?? [],
      pages: flatData.pages?.map(parseGraphQLPage) ?? [],
    };
  }
}
