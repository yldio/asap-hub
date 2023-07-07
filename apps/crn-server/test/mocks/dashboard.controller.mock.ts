import DashboardController from '../../src/controllers/dashboard.controller';

export const dashboardControllerMock = {
  fetch: jest.fn(),
} as unknown as jest.Mocked<DashboardController>;
