import { DataProvider, gp2 } from '@asap-hub/model';

export type DashboardDataProvider = DataProvider<
  gp2.DashboardDataObject,
  gp2.FetchDashboardOptions
>;
