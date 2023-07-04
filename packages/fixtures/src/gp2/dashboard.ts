import { gp2 } from '@asap-hub/model';

const mockedDashboardStats: gp2.DashboardResponse = {
  latestStats: { articleCount: 31, cohortCount: 12, sampleCount: 32131 },
  announcements: [
    {
      deadline: new Date().getTime().toString(),
      description: 'Test',
      id: '123',
    },
    {
      deadline: new Date().getTime().toString(),
      description: 'Test 2',
      link: 'https://google.com',
      id: '231',
    },
  ],
};

export const createDashboardStatsResponse = (
  items = [mockedDashboardStats],
): gp2.ListDashboardResponse => ({
  items,
  total: items.length,
});
