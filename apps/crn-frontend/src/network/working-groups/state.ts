import { WorkingGroupResponse } from '@asap-hub/model';
import { atomFamily, selectorFamily, useRecoilValue } from 'recoil';
import { authorizationState } from '../../auth/state';
import { getWorkingGroup } from './api';

export const refreshWorkingGroupState = atomFamily<number, string>({
  key: 'refreshWorkingGroup',
  default: 0,
});
const fetchWorkingGroupState = selectorFamily<
  WorkingGroupResponse | undefined,
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

export const workingGroupState = atomFamily<
  WorkingGroupResponse | undefined,
  string
>({
  key: 'workingGroup',
  default: fetchWorkingGroupState,
});

export const useWorkingGroupById = (id: string) =>
  useRecoilValue(workingGroupState(id));
