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
      return {
        total: 1,
        items: [
          {
            sampleCount: 0,
            cohortCount: 0,
            articleCount: 0,
          },
        ],
      };
    }
    return {
      total,
      items,
    };
  }
}
