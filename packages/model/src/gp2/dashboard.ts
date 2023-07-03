import { AllOrNone, ListResponse } from '../common';
import { AnnouncementDataObject } from './announcement';
import { StatsDataObject } from './stats';

export type DashboardDataObject = {
  latestStats: StatsDataObject;
  announcements: AnnouncementDataObject[];
};

export type ListDashboardDataObject = ListResponse<DashboardDataObject>;

export type DashboardResponse = DashboardDataObject;

export type ListDashboardResponse = ListResponse<DashboardResponse>;

export type FetchDashboardOptions = AllOrNone<{
  sortBy: 'deadline' | 'published';
  sortOrder: 'asc' | 'desc';
}>;
