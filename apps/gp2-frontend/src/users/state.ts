import { gp2 } from '@asap-hub/model';
import { atom, atomFamily, selector, useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getUsers } from './api';

export const fetchUsersState = selector<gp2.ListUserResponse>({
  key: 'fetchUsersState',
  get: ({ get }) => {
    get(refreshUsersState);
    return getUsers(get(authorizationState));
  },
});

export const usersState = atom<gp2.ListUserResponse>({
  key: 'userState',
  default: fetchUsersState,
});

export const refreshUsersState = atom<number>({
  key: 'refreshUsersState',
  default: 0,
});

export const refreshUserState = atomFamily<number, string>({
  key: 'refreshUser',
  default: 0,
});

export const useUsersState = () => useRecoilValue(usersState);
