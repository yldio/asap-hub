import { DashboardResponse } from '@asap-hub/model';

import { InstrumentedSquidexGraphql } from '../utils/instrumented-client';
import { parseGraphQLPage, parseGraphQLNews } from '../entities';
import { FETCH_DASHBOARD } from '../queries/dashboard.queries';
import { FetchDashboardQuery } from '../gql/graphql';

export interface DashboardController {
  fetch: () => Promise<DashboardResponse>;
}

export default class Dashboard {
  client: InstrumentedSquidexGraphql;

  constructor(ctxHeaders?: Record<string, string>) {
    this.client = new InstrumentedSquidexGraphql(ctxHeaders);
  }

  async fetch(): Promise<DashboardResponse> {
    const res = await this.client.request<FetchDashboardQuery, unknown>(
      FETCH_DASHBOARD,
    );
    if (
      !res.queryDashboardContents ||
      res.queryDashboardContents.length === 0
    ) {
      return {
        news: [],
        pages: [],
      };
    }

    return {
      news:
        res.queryDashboardContents[0]?.flatData.news?.map(parseGraphQLNews) ??
        [],
      pages:
        res.queryDashboardContents[0]?.flatData.pages?.map(parseGraphQLPage) ??
        [],
    };
  }
}
