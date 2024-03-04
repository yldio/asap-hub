import { ListAnalyticsTeamLeadershipResponse } from '@asap-hub/model';
import AnalyticsController from '../../src/controllers/analytics.controller';
import {
  getListAnalyticsTeamLeadershipDataObject,
  getListAnalyticsTeamLeadershipResponse,
} from '../fixtures/analytics.fixtures';
import { analyticsDataProviderMock } from '../mocks/analytics.data-provider.mock';

describe('Analytics controller', () => {
  const analyticsController = new AnalyticsController(
    analyticsDataProviderMock,
  );

  describe('Fetch method', () => {
    test('Should return an empty result when the data provider returns an empty list', async () => {
      analyticsDataProviderMock.fetchTeamLeaderShip.mockResolvedValue({
        total: 0,
        items: [],
      });

      const result = await analyticsController.fetchTeamLeaderShip();

      expect(result).toEqual({
        total: 0,
        items: [],
      } satisfies ListAnalyticsTeamLeadershipResponse);
    });

    test('Should return the analytics team leadership', async () => {
      analyticsDataProviderMock.fetchTeamLeaderShip.mockResolvedValue(
        getListAnalyticsTeamLeadershipDataObject(),
      );

      const result = await analyticsController.fetchTeamLeaderShip();

      expect(result).toEqual(getListAnalyticsTeamLeadershipResponse());
    });
  });
});
