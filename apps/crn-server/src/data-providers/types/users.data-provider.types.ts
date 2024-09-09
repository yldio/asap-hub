import {
  DataProvider,
  FetchUsersOptions,
  ListPublicUserDataObject,
  UserCreateDataObject,
  UserDataObject,
  UserListItemDataObject,
  UserUpdateDataObject,
} from '@asap-hub/model';

export type UserDataProvider = DataProvider<
  UserDataObject,
  UserListItemDataObject,
  FetchUsersOptions,
  UserCreateDataObject,
  null,
  UserUpdateDataObject,
  { suppressConflict?: boolean; polling?: boolean }
> & {
  fetchPublicUsers: (
    options: FetchUsersOptions,
  ) => Promise<ListPublicUserDataObject>;
};
