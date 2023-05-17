import { DataProvider, FetchOptions, gp2 } from '@asap-hub/model';

export type ExternalUserDataProvider = DataProvider<
  gp2.ExternalUserDataObject,
  FetchOptions,
  gp2.ExternalUserCreateDataObject
>;
