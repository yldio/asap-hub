import { DashboardResponse } from '@asap-hub/model';
import { SquidexGraphqlClient } from '@asap-hub/squidex';

export interface DashboardController {
  fetch: () => Promise<DashboardResponse>;
}

export default class Dashboard {
  squidexGraphqlClient: SquidexGraphqlClient;

  constructor(squidexGraphqlClient: SquidexGraphqlClient) {
    this.squidexGraphqlClient = squidexGraphqlClient;
  }

  // eslint-disable-next-line class-methods-use-this
  async fetch(): Promise<DashboardResponse> {
    return {
      news: [],
      pages: [],
    };
  }
}
