import { DashboardResponse } from '@asap-hub/model';
import { createPageResponse } from './pages';
import { createNewsResponse } from './news';

export const createDashboardResponse = (
  length: number = 5,
): DashboardResponse => ({
  news: [
    ...Array.from({ length }).map((_, i) =>
      createNewsResponse({ key: i, type: 'News' }),
    ),
    ...Array.from({ length }).map((_, i) =>
      createNewsResponse({ key: i, type: 'News' }),
    ),
  ],
  pages: ['content', 'about', 'slides'].map(createPageResponse),
});
