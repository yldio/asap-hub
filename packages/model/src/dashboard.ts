import { NewsResponse } from './news';
import { PageResponse } from './page';

export interface DashboardResponse {
  news: ReadonlyArray<NewsResponse>;
  pages: ReadonlyArray<PageResponse>;
}
