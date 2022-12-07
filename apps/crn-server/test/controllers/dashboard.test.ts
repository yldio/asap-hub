import Dashboard from '../../src/controllers/dashboard';
import {
  getDashboardResponse,
  getDashboardDataObject,
} from '../fixtures/dashboard.fixtures';
import { dashboardDataProviderMock } from '../mocks/dashboard-data-provider.mock';

describe('Dashboard controller', () => {
  const dashboardController = new Dashboard(dashboardDataProviderMock);

  describe('Fetch method', () => {
    test('Should return an empty result when the data provider returns an empty list', async () => {
      dashboardDataProviderMock.fetch.mockResolvedValue({
        news: [],
        pages: [],
      });

      const result = await dashboardController.fetch();

      expect(result).toEqual({
        news: [],
        pages: [],
      });
    });

    test('Should return the dashboard news', async () => {
      dashboardDataProviderMock.fetch.mockResolvedValue(
        getDashboardDataObject(),
      );

      const result = await dashboardController.fetch();

      expect(result).toEqual(getDashboardResponse());
    });
  });
});
