import { ListAnalyticsTeamLeadershipDataObject } from '@asap-hub/model';

export type AnalyticsDataProvider = {
  fetchTeamLeaderShip: () => Promise<ListAnalyticsTeamLeadershipDataObject>;
};
