import { gp2 } from '@asap-hub/model';
import { atom, atomFamily, selectorFamily, useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getUser, getUsers } from './api';

export const usersState = selectorFamily<
  gp2.ListUserResponse,
  gp2.FetchUsersOptions
>({
  key: 'usersState',
  get:
    (options) =>
    ({ get }) => {
      get(refreshUsersState);
      return getUsers(options, get(authorizationState));
    },
});

export const refreshUsersState = atom<number>({
  key: 'refreshUsersState',
  default: 0,
});

export const refreshUserState = atomFamily<number, string>({
  key: 'refreshUser',
  default: 0,
});

const fetchUserState = selectorFamily<gp2.UserResponse | undefined, string>({
  key: 'fetchUser',
  get:
    (id) =>
    async ({ get }) => {
      get(refreshUserState(id));
      const authorization = get(authorizationState);
      return getUser(id, authorization);
    },
});

const userState = atomFamily<gp2.UserResponse | undefined, string>({
  key: 'user',
  default: fetchUserState,
});

export const useUsersState = (options: gp2.FetchUsersOptions) =>
  useRecoilValue(usersState(options));

export const useUserById = (id: string) => useRecoilValue(userState(id));
