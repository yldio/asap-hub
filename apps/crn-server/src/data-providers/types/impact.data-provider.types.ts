import { DataProvider, FetchOptions, ImpactDataObject } from '@asap-hub/model';

export type ImpactDataProvider = DataProvider<
  ImpactDataObject,
  ImpactDataObject,
  FetchOptions
>;
