import { gp2 } from '@asap-hub/model';
import { DashboardDataProvider } from '../data-providers/types/dashboard.data-provider.type';

export default class DashboardController {
  constructor(private dashboardDataProvider: DashboardDataProvider) {}

  async fetch(
    options: gp2.FetchDashboardOptions,
  ): Promise<gp2.ListDashboardResponse> {
    const { total, items } = await this.dashboardDataProvider.fetch(options);

    if (items.length === 0) {
      return {
        total: 1,
        items: [
          {
            latestStats: {
              sampleCount: 0,
              cohortCount: 0,
              articleCount: 0,
            },
            announcements: [],
            guides: [],
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
