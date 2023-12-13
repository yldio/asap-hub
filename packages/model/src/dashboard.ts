import { AnnouncementDataObject, AnnouncementResponse } from './announcement';
import { NewsDataObject, NewsResponse } from './news';
import { PageDataObject, PageResponse } from './page';

export type DashboardDataObject = {
  announcements: AnnouncementDataObject[];
  news: NewsDataObject[];
  pages: PageDataObject[];
};

export type DashboardResponse = {
  announcements: AnnouncementResponse[];
  news: NewsResponse[];
  pages: PageResponse[];
};
