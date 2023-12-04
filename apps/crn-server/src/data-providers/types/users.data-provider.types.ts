import {
  FetchUsersOptions,
  UserCreateDataObject,
  UserDataObject,
  UserUpdateDataObject,
  DataProvider,
} from '@asap-hub/model';

export type UserDataProvider = DataProvider<
  UserDataObject,
  UserDataObject,
  FetchUsersOptions,
  UserCreateDataObject,
  null,
  UserUpdateDataObject
>;
