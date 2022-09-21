import { DashboardResponse } from '@asap-hub/model';
import { createPageResponse } from './pages';
import { createNewsResponse } from './news';

export const createDashboardResponse = (
  length: number = 5,
): DashboardResponse => ({
  news: [
    ...Array.from({ length }).map((_, i) => createNewsResponse(`${i}`, 'News')),
    ...Array.from({ length }).map((_, i) => createNewsResponse(`${i}`, 'News')),
  ],
  pages: ['content', 'about', 'slides'].map(createPageResponse),
});
