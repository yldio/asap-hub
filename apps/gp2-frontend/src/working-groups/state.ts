import { ListWorkingGroupsResponse } from '@asap-hub/model/build/gp2';
import { atom, selector, useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getWorkingGroups } from './api';

export const fetchWorkingGroupsState = selector<ListWorkingGroupsResponse>({
  key: 'fetchWorkingGroupsState',
  get: ({ get }) => {
    get(refreshWorkingGroupsState);
    return getWorkingGroups(get(authorizationState));
  },
});

export const workingGroupsState = atom<ListWorkingGroupsResponse>({
  key: 'workingGroupState',
  default: fetchWorkingGroupsState,
});

export const refreshWorkingGroupsState = atom<number>({
  key: 'refreshWorkingGroupsState',
  default: 0,
});

export const useWorkingGroupsState = () => useRecoilValue(workingGroupsState);
