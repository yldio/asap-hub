import { DashboardDataProvider } from '../../src/data-providers/types';

export const dashboardDataProviderMock: jest.Mocked<DashboardDataProvider> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
};
