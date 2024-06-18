import {
  FetchAnalyticsOptions,
  FetchPaginationOptions,
  ListAnalyticsTeamLeadershipResponse,
  ListTeamCollaborationResponse,
  ListTeamProductivityResponse,
  ListUserCollaborationResponse,
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

  async fetchUserCollaboration(
    options: FetchAnalyticsOptions,
  ): Promise<ListUserCollaborationResponse> {
    return this.analyticsDataProvider.fetchUserCollaboration(options);
  }

  async fetchTeamCollaboration(
    options: FetchAnalyticsOptions,
  ): Promise<ListTeamCollaborationResponse> {
    return this.analyticsDataProvider.fetchTeamCollaboration(options);
  }
}
