import { NewsAndEventsResponse } from './news-and-events';
import { PageResponse } from './page';

export interface DashboardResponse {
  newsAndEvents: ReadonlyArray<NewsAndEventsResponse>;
  pages: ReadonlyArray<PageResponse>;
}
