import { gp2 } from '@asap-hub/model';
import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { authorizationState } from '../auth/state';
import {
  getWorkingGroup,
  getWorkingGroupNetwork,
  getWorkingGroups,
  putWorkingGroupResources,
} from './api';

const fetchWorkingGroupNetworkState =
  selector<gp2.ListWorkingGroupNetworkResponse>({
    key: 'fetchWorkingGroupNetwork',
    get: ({ get }) => getWorkingGroupNetwork(get(authorizationState)),
  });

const workingGroupNetworkState = atom<gp2.ListWorkingGroupNetworkResponse>({
  key: 'workingGroupNetwork',
  default: fetchWorkingGroupNetworkState,
});

export const refreshWorkingGroupNetworkState = atom<number>({
  key: 'refreshWorkingGroupNetwork',
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

export const useWorkingGroupNetworkState = () =>
  useRecoilValue(workingGroupNetworkState);

export const useWorkingGroupById = (id: string) =>
  useRecoilValue(workingGroupState(id));

export const usePutWorkingGroupResources = (id: string) => {
  const authorization = useRecoilValue(authorizationState);
  const setWorkingGroupItem = useSetWorkingGroupItem();
  return async (payload: gp2.WorkingGroupResourcesPutRequest) => {
    const workingGroup = await putWorkingGroupResources(
      id,
      payload,
      authorization,
    );
    setWorkingGroupItem(workingGroup);
  };
};

export const useSetWorkingGroupItem = () => {
  const [refresh, setRefresh] = useRecoilState(refreshWorkingGroupNetworkState);
  return useRecoilCallback(
    ({ set }) =>
      (workingGroup: gp2.WorkingGroupResponse) => {
        set(workingGroupState(workingGroup.id), workingGroup);
        setRefresh(refresh + 1);
      },
  );
};

export const refreshWorkingGroupsState = atom<number>({
  key: 'refreshWorkingGroups',
  default: 0,
});

const fetchWorkingGroupsState = selector<gp2.ListWorkingGroupResponse>({
  key: 'fetchWorkingGroups',
  get: ({ get }) => {
    get(refreshWorkingGroupsState);
    return getWorkingGroups(get(authorizationState));
  },
});

const workingGroupsState = atom<gp2.ListWorkingGroupResponse>({
  key: 'workingGroups',
  default: fetchWorkingGroupsState,
});
export const useWorkingGroupsState = () => useRecoilValue(workingGroupsState);
