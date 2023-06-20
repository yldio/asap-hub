import { DashboardResponse } from '@asap-hub/model';
import { DashboardDataProvider } from '../data-providers/types';

export interface DashboardController {
  fetch: () => Promise<DashboardResponse>;
}

export default class Dashboard implements DashboardController {
  constructor(private dashboardDataProvider: DashboardDataProvider) {}

  async fetch(): Promise<DashboardResponse> {
    return this.dashboardDataProvider.fetch();
  }
}
