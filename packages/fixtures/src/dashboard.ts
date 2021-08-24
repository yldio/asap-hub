import { DashboardResponse } from '@asap-hub/model';
import { createPageResponse } from './pages';
import { createNewsAndEventsResponse } from './news-and-events';

export const createDashboardResponse = (
  length: number = 5,
): DashboardResponse => ({
  newsAndEvents: [
    ...Array.from({ length }).map((_, i) =>
      createNewsAndEventsResponse(`${i}`, 'News'),
    ),
    ...Array.from({ length }).map((_, i) =>
      createNewsAndEventsResponse(`${i}`, 'Event'),
    ),
  ],
  pages: ['content', 'about', 'slides'].map(createPageResponse),
});
