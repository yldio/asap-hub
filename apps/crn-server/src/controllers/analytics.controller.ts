import {
  FetchPaginationOptions,
  ListAnalyticsTeamLeadershipResponse,
} from '@asap-hub/model';
import { AnalyticsDataProvider } from '../data-providers/types/analytics.data-provider.types';

export default class AnalyticsController {
  constructor(private analyticsDataProvider: AnalyticsDataProvider) {}

  async fetchTeamLeaderShip(
    options: FetchPaginationOptions,
  ): Promise<ListAnalyticsTeamLeadershipResponse> {
    return this.analyticsDataProvider.fetchTeamLeaderShip(options);
  }
}
