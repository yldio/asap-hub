import Dashboard from '../../src/controllers/dashboard.controller';
import {
  getListDashboardDataObject,
  getListDashboardResponse,
} from '../fixtures/dashboard.fixtures';
import { dashboardDataProviderMock } from '../mocks/dashboard-data-provider.mock';

describe('Dashboard controller', () => {
  const dashboardController = new Dashboard(dashboardDataProviderMock);

  describe('Fetch method', () => {
    test('Should return an empty result when no dashboard exist', async () => {
      dashboardDataProviderMock.fetch.mockResolvedValue({
        total: 0,
        items: [],
      });
      const result = await dashboardController.fetch({});

      expect(result).toEqual({
        items: [
          {
            latestStats: { sampleCount: 0, cohortCount: 0, articleCount: 0 },
            announcements: [],
            guides: [],
          },
        ],
        total: 1,
      });
    });

    test('Should fetch the dashboard', async () => {
      dashboardDataProviderMock.fetch.mockResolvedValue(
        getListDashboardDataObject(),
      );

      const result = await dashboardController.fetch({});

      expect(result).toMatchObject(getListDashboardResponse());
    });
  });
});
