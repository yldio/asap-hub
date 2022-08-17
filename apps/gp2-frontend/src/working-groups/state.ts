import { gp2 } from '@asap-hub/model';
import { atom, selector, useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getWorkingGroups } from './api';

export const fetchWorkingGroupsState = selector<gp2.ListWorkingGroupsResponse>({
  key: 'fetchWorkingGroupsState',
  get: ({ get }) => {
    get(refreshWorkingGroupsState);
    return getWorkingGroups(get(authorizationState));
  },
});

export const workingGroupsState = atom<gp2.ListWorkingGroupsResponse>({
  key: 'workingGroupState',
  default: fetchWorkingGroupsState,
});

export const refreshWorkingGroupsState = atom<number>({
  key: 'refreshWorkingGroupsState',
  default: 0,
});

export const useWorkingGroupsState = () => useRecoilValue(workingGroupsState);
