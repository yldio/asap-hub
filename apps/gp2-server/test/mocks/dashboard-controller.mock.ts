import { DashboardController } from '../../src/controllers/dashboard.controller';

export const dashboardControllerMock: jest.Mocked<DashboardController> = {
  fetch: jest.fn(),
};
