import {
  FetchAnalyticsOptions,
  FetchPaginationOptions,
  ListAnalyticsTeamLeadershipDataObject,
  ListTeamProductivityDataObject,
  ListUserCollaborationDataObject,
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
  fetchUserCollaboration: (
    options: FetchAnalyticsOptions,
  ) => Promise<ListUserCollaborationDataObject>;
};
