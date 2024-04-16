import {
  FetchAnalyticsOptions,
  FetchPaginationOptions,
  ListAnalyticsTeamLeadershipDataObject,
  ListTeamProductivityDataObject,
  ListUserProductivityDataObject,
} from '@asap-hub/model';

export type AnalyticsDataProvider = {
  fetchTeamLeadership: (
    options: FetchPaginationOptions,
  ) => Promise<ListAnalyticsTeamLeadershipDataObject>;
  fetchUserProductivity: (
    options: FetchAnalyticsOptions,
  ) => Promise<ListUserProductivityDataObject>;
  fetchTeamProductivity: (
    options: FetchAnalyticsOptions,
  ) => Promise<ListTeamProductivityDataObject>;
};
