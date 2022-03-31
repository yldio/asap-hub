import {
  atomFamily,
  selectorFamily,
  useRecoilValue,
  DefaultValue,
} from 'recoil';
import { UserResponse, ListUserResponse } from '@asap-hub/model';

import { authorizationState } from '../../auth/state';
import { getUser } from './api';
import { GetListOptions } from '../../api-util';

const userIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  GetListOptions
>({
  key: 'userIndex',
  default: undefined,
});
export const usersState = selectorFamily<
  ListUserResponse | Error | undefined,
  GetListOptions
>({
  key: 'users',
  get:
    (options) =>
    ({ get }) => {
      const index = get(userIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const users: UserResponse[] = [];
      for (const id of index.ids) {
        const user = get(userState(id));
        if (user === undefined) return undefined;
        users.push(user);
      }
      return { total: index.total, items: users };
    },
  set:
    (options) =>
    ({ get, set, reset }, newUsers) => {
      if (newUsers === undefined || newUsers instanceof DefaultValue) {
        const oldUsers = get(userIndexState(options));
        if (!(oldUsers instanceof Error)) {
          oldUsers?.ids?.forEach((id) => reset(patchedUserState(id)));
        }
        reset(userIndexState(options));
      } else if (newUsers instanceof Error) {
        set(userIndexState(options), newUsers);
      } else {
        newUsers?.items.forEach((user) => set(patchedUserState(user.id), user));
        set(userIndexState(options), {
          total: newUsers.total,
          ids: newUsers.items.map((user) => user.id),
        });
      }
    },
});

export const refreshUserState = atomFamily<number, string>({
  key: 'refreshUser',
  default: 0,
});
const initialUserState = selectorFamily<UserResponse | undefined, string>({
  key: 'initialUser',
  get:
    (id) =>
    async ({ get }) => {
      get(refreshUserState(id));
      const authorization = get(authorizationState);
      return getUser(id, authorization);
    },
});

const patchedUserState = atomFamily<UserResponse | undefined, string>({
  key: 'patchedUser',
  default: undefined,
});

const userState = selectorFamily<UserResponse | undefined, string>({
  key: 'user',
  get:
    (id) =>
    ({ get }) =>
      get(patchedUserState(id)) ?? get(initialUserState(id)),
});

export const useUserById = (id: string) => useRecoilValue(userState(id));
