import { DashboardResponse } from '@asap-hub/model';
import Dashboard from '../../src/controllers/dashboard.controller';
import { DashboardDataProvider } from '../../src/data-providers/types';
import {
  getDashboardResponse,
  getDashboardDataObject,
} from '../fixtures/dashboard.fixtures';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Dashboard controller', () => {
  const dashboardDataProviderMock =
    getDataProviderMock() as jest.Mocked<DashboardDataProvider>;
  const dashboardController = new Dashboard(dashboardDataProviderMock);

  describe('Fetch method', () => {
    test('Should return an empty result when the data provider returns an empty list', async () => {
      dashboardDataProviderMock.fetch.mockResolvedValue({
        news: [],
        pages: [],
        announcements: [],
      });

      const result = await dashboardController.fetch();

      expect(result).toEqual({
        news: [],
        pages: [],
        announcements: [],
      } satisfies DashboardResponse);
    });

    test('Should return the dashboard news and pages', async () => {
      dashboardDataProviderMock.fetch.mockResolvedValue(
        getDashboardDataObject(),
      );

      const result = await dashboardController.fetch();

      expect(result).toEqual(getDashboardResponse());
    });
  });
});
