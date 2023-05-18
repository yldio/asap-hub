import { DataProvider, gp2 } from '@asap-hub/model';

export type ExternalUserDataProvider = DataProvider<
  gp2.ExternalUserDataObject,
  gp2.FetchExternalUsersOptions,
  gp2.ExternalUserCreateDataObject
>;
