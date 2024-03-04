import {
  FetchPaginationOptions,
  ListAnalyticsTeamLeadershipDataObject,
} from '@asap-hub/model';

export type AnalyticsDataProvider = {
  fetchTeamLeaderShip: (
    options: FetchPaginationOptions,
  ) => Promise<ListAnalyticsTeamLeadershipDataObject>;
};
