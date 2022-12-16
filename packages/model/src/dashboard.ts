import { NewsDataObject, NewsResponse } from './news';
import { PageDataObject, PageResponse } from './page';

export type DashboardDataObject = {
  news: NewsDataObject[];
  pages: PageDataObject[];
};

export type DashboardResponse = {
  news: NewsResponse[];
  pages: PageResponse[];
};
