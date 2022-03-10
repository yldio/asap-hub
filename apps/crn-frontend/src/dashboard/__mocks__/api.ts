import { DashboardResponse } from '@asap-hub/model';
import { createDashboardResponse } from '@asap-hub/fixtures';

export const getDashboard = jest.fn(
  async (): Promise<DashboardResponse> => createDashboardResponse(),
);
