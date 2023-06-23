import { gp2 } from '@asap-hub/model';
import { DashboardDataProvider } from '../data-providers/types/dashboard.data-provider.type';

export interface DashboardController {
  fetch: () => Promise<gp2.ListDashboardResponse>;
}

export default class Dashboard implements DashboardController {
  constructor(private dashboardDataProvider: DashboardDataProvider) {}

  async fetch(): Promise<gp2.ListDashboardResponse> {
    const { total, items } = await this.dashboardDataProvider.fetch(null);

    return {
      total,
      items,
    };
  }
}
