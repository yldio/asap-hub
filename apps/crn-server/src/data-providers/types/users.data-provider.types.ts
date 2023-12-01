import {
  DataProvider,
  FetchUsersOptions,
  UserCreateDataObject,
  UserDataObject,
  UserUpdateDataObject,
} from '@asap-hub/model';

export type UserDataProvider = DataProvider<
  UserDataObject,
  UserDataObject,
  FetchUsersOptions,
  UserCreateDataObject,
  null,
  UserUpdateDataObject,
  { suppressConflict?: boolean }
>;
