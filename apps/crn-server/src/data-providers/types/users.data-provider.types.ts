import {
  DataProvider,
  FetchUsersOptions,
  UserCreateDataObject,
  UserDataObject,
  UserListItem,
  UserUpdateDataObject,
} from '@asap-hub/model';

export type UserDataProvider = DataProvider<
  UserDataObject,
  UserListItem,
  FetchUsersOptions,
  UserCreateDataObject,
  null,
  UserUpdateDataObject,
  { suppressConflict?: boolean }
>;
