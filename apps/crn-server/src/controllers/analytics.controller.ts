import {
  FetchAnalyticsOptions,
  FetchPaginationOptions,
  ListAnalyticsTeamLeadershipResponse,
  ListTeamProductivityResponse,
  ListUserProductivityResponse,
} from '@asap-hub/model';
import { AnalyticsDataProvider } from '../data-providers/types/analytics.data-provider.types';

export default class AnalyticsController {
  constructor(private analyticsDataProvider: AnalyticsDataProvider) {}

  async fetchTeamLeadership(
    options: FetchPaginationOptions,
  ): Promise<ListAnalyticsTeamLeadershipResponse> {
    return this.analyticsDataProvider.fetchTeamLeadership(options);
  }

  async fetchUserProductivity(
    options: FetchAnalyticsOptions,
  ): Promise<ListUserProductivityResponse> {
    return this.analyticsDataProvider.fetchUserProductivity(options);
  }

  async fetchTeamProductivity(
    options: FetchAnalyticsOptions,
  ): Promise<ListTeamProductivityResponse> {
    return this.analyticsDataProvider.fetchTeamProductivity(options);
  }
}
