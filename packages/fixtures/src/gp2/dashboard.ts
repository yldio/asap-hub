import { gp2 } from '@asap-hub/model';

const mockedDashboardStats: gp2.DashboardResponse = {
  articleCount: 31,
  cohortCount: 12,
  sampleCount: 32131,
};

export const createDashboardStatsResponse = (
  items = [mockedDashboardStats],
): gp2.ListDashboardResponse => ({
  items,
  total: items.length,
});
