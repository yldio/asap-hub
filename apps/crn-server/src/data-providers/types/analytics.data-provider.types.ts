import {
  FetchPaginationOptions,
  ListAnalyticsTeamLeadershipDataObject,
} from '@asap-hub/model';

export type AnalyticsDataProvider = {
  fetchTeamLeadership: (
    options: FetchPaginationOptions,
  ) => Promise<ListAnalyticsTeamLeadershipDataObject>;
};
