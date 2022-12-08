import { DashboardDataProvider } from '../../src/data-providers/dashboard.data-provider';

export const dashboardDataProviderMock: jest.Mocked<DashboardDataProvider> = {
  fetch: jest.fn(),
};
