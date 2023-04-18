import { DashboardDataObject } from '@asap-hub/model';

export type DashboardDataProvider = {
  fetch: () => Promise<DashboardDataObject>;
};
