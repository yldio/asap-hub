import { DashboardResponse } from '@asap-hub/model';
import { DashboardDataProvider } from '../data-providers/types';

export default class DashboardController {
  constructor(private dashboardDataProvider: DashboardDataProvider) {}

  async fetch(): Promise<DashboardResponse> {
    return this.dashboardDataProvider.fetch();
  }
}
