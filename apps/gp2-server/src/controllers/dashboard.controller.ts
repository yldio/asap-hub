/* istanbul ignore file */
// ignore this file for coverage since we don't have the requirements yet to test it
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

  async fetch(): Promise<DashboardResponse> {
    return {
      news: [],
      pages: [],
    };
  }
}
