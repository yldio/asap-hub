import { DataProvider, gp2 } from '@asap-hub/model';

export type FetchWorkingGroupNetworkProviderOptions = null;

export type WorkingGroupNetworkDataProvider = DataProvider<
  gp2.WorkingGroupNetworkDataObject,
  FetchWorkingGroupNetworkProviderOptions
>;
