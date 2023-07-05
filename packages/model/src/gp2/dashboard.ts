import { AllOrNone, ListResponse } from '../common';
import { AnnouncementDataObject } from './announcement';
// import { GuideDescriptionDataObject } from './guides';
import { StatsDataObject } from './stats';

export type DashboardDataObject = {
  latestStats: StatsDataObject;
  announcements: AnnouncementDataObject[];
  // guides: GuideDescriptionDataObject[];
};

export type ListDashboardDataObject = ListResponse<DashboardDataObject>;

export type DashboardResponse = DashboardDataObject;

export type ListDashboardResponse = ListResponse<DashboardResponse>;

export type FetchDashboardOptions = AllOrNone<{
  sortBy: 'deadline' | 'published';
  sortOrder: 'asc' | 'desc';
}>;
