import { ListAnalyticsTeamLeadershipResponse } from '@asap-hub/model';

export default class AnalyticsController {
  async fetchTeamLeaderShip(): Promise<ListAnalyticsTeamLeadershipResponse> {
    return {
      total: 0,
      items: [],
    };
  }
}
