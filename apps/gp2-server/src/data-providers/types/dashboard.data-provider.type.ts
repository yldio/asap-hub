import { DataProvider, gp2 } from '@asap-hub/model';

export type FetchDashboardProviderOptions = null;

export type DashboardDataProvider = DataProvider<
  gp2.DashboardDataObject,
  FetchDashboardProviderOptions
>;
