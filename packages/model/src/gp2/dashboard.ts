import { ListResponse } from '../common';

export type DashboardDataObject = {
  sampleCount: number;
  articleCount: number;
  cohortCount: number;
};

export type DashboardResponse = DashboardDataObject;

export type ListDashboardResponse = ListResponse<DashboardResponse>;
