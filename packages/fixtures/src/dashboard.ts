import { DashboardResponse } from '@asap-hub/model';
import { createNewsResponse } from './news';
import { createPageResponse } from './pages';

export const createDashboardResponse = (
  length: number = 5,
): DashboardResponse => ({
  news: [
    ...Array.from({ length }).map((_, i) => createNewsResponse({ key: i })),
  ],
  pages: ['content', 'about', 'slides'].map(createPageResponse),
  announcements: [
    {
      deadline: new Date().getTime().toString(),
      description: 'Test',
      id: '123',
    },
  ],
});
