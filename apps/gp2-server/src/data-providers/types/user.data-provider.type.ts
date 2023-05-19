import { DataProvider, gp2 as gp2Model } from '@asap-hub/model';

export type UserDataProvider = DataProvider<
  gp2Model.UserDataObject,
  gp2Model.FetchUsersOptions,
  gp2Model.UserCreateDataObject,
  null,
  gp2Model.UserUpdateDataObject
>;
