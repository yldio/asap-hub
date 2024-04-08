import {
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
    options: FetchPaginationOptions,
  ) => Promise<ListUserProductivityDataObject>;
  fetchTeamProductivity: (
    options: FetchPaginationOptions,
  ) => Promise<ListTeamProductivityDataObject>;
};
