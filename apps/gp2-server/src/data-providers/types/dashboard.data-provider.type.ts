import { DataProvider, gp2 } from '@asap-hub/model';
import { FetchDashboardOptions } from '@asap-hub/model/src/gp2';

export type DashboardDataProvider = DataProvider<
  gp2.DashboardDataObject,
  FetchDashboardOptions
>;
