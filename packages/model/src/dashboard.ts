import { NewsOrEventResponse } from './news-and-events';
import { PageResponse } from './page';

export interface DashboardResponse {
  newsAndEvents: ReadonlyArray<NewsOrEventResponse>;
  pages: ReadonlyArray<PageResponse>;
}
