import { DashboardResponse } from '@asap-hub/model';
import { DashboardDataProvider } from '../data-providers/dashboard.data-provider';

export interface DashboardController {
  fetch: () => Promise<DashboardResponse>;
}

export default class Dashboard {
  constructor(private dashboardDataProvider: DashboardDataProvider) {}

  async fetch(): Promise<DashboardResponse> {
    return this.dashboardDataProvider.fetch();
  }
}
