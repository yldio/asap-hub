import { DashboardController } from '../../src/controllers/dashboard';

export const dashboardControllerMock: jest.Mocked<DashboardController> = {
  fetch: jest.fn(),
};
