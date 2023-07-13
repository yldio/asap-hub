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
  guides: [
    {
      id: '12',
      icon: 'https://google.com',
      title: 'Discover how to use the GP2 Hub',
      description: [
        {
          id: '1',
          bodyText:
            'Learn more about the GP2 Hub and how to use different aspects.',
        },
      ],
    },
  ],
};

export const createDashboardStatsResponse = (
  items = [mockedDashboardStats],
): gp2.ListDashboardResponse => ({
  items,
  total: items.length,
});
