import { DataProvider, FetchOptions, LabDataObject } from '@asap-hub/model';

export type LabDataProvider = DataProvider<
  LabDataObject,
  LabDataObject,
  FetchOptions
>;
