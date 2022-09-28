import { GetListOptions } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { atom, atomFamily, selectorFamily, useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getUsers } from './api';

export const usersState = selectorFamily<gp2.ListUserResponse, GetListOptions>({
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

export const useUsersState = (options: GetListOptions) =>
  useRecoilValue(usersState(options));
