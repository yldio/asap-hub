import { gp2 } from '@asap-hub/model';
import { DashboardDataProvider } from '../data-providers/types/dashboard.data-provider.type';

export interface DashboardController {
  fetch: () => Promise<gp2.ListDashboardResponse>;
}

export default class Dashboard implements DashboardController {
  constructor(private dashboardDataProvider: DashboardDataProvider) {}

  async fetch(): Promise<gp2.ListDashboardResponse> {
    const { total, items } = await this.dashboardDataProvider.fetch(null);
    if (items.length === 0) {
      throw new Error('No dashboard data found');
    }
    // const dashboard = items[0];
    // if (!dashboard) {
    //   throw new Error('No dashboard data found');
    // }
    // return dashboard;

    return {
      total,
      items,
    };
  }
}
