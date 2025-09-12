import {
  FetchAnalyticsOptions,
  FetchPaginationOptions,
  ListAnalyticsTeamLeadershipDataObject,
  ListEngagementDataObject,
  ListMeetingRepAttendanceDataObject,
  ListOSChampionDataObject,
  ListPreliminaryDataSharingDataObject,
  ListTeamCollaborationDataObject,
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
  fetchTeamCollaboration: (
    options: FetchAnalyticsOptions,
  ) => Promise<ListTeamCollaborationDataObject>;
  fetchEngagement(
    options: FetchAnalyticsOptions,
  ): Promise<ListEngagementDataObject>;
  fetchOSChampion(
    options: FetchAnalyticsOptions,
  ): Promise<ListOSChampionDataObject>;
  fetchPreliminaryDataSharing(
    options: FetchAnalyticsOptions,
  ): Promise<ListPreliminaryDataSharingDataObject>;
  fetchAttendance(
    options: FetchAnalyticsOptions,
  ): Promise<ListMeetingRepAttendanceDataObject>;
};
