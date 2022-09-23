import { gp2 } from '@asap-hub/model';
import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useRecoilValue,
} from 'recoil';
import { authorizationState } from '../auth/state';
import { getWorkingGroup, getWorkingGroups } from './api';

export const fetchWorkingGroupsState =
  selector<gp2.ListWorkingGroupNetworkResponse>({
    key: 'fetchWorkingGroupsState',
    get: ({ get }) => {
      get(refreshWorkingGroupsState);
      return getWorkingGroups(get(authorizationState));
    },
  });

export const workingGroupsState = atom<gp2.ListWorkingGroupNetworkResponse>({
  key: 'workingGroupState',
  default: fetchWorkingGroupsState,
});

export const refreshWorkingGroupsState = atom<number>({
  key: 'refreshWorkingGroupsState',
  default: 0,
});

export const refreshWorkingGroupState = atomFamily<number, string>({
  key: 'refreshWorkingGroup',
  default: 0,
});
const fetchWorkingGroupState = selectorFamily<
  gp2.WorkingGroupResponse | undefined,
  string
>({
  key: 'fetchWorkingGroup',
  get:
    (id) =>
    async ({ get }) => {
      get(refreshWorkingGroupState(id));
      const authorization = get(authorizationState);
      return getWorkingGroup(id, authorization);
    },
});

const workingGroupState = atomFamily<
  gp2.WorkingGroupResponse | undefined,
  string
>({
  key: 'workingGroup',
  default: fetchWorkingGroupState,
});

export const useWorkingGroupsState = () => useRecoilValue(workingGroupsState);

export const useWorkingGroupById = (id: string) =>
  useRecoilValue(workingGroupState(id));
