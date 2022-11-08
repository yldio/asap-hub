import { gp2 } from '@asap-hub/model';
import {
  atom,
  atomFamily,
  ReadWriteSelectorOptions,
  selector,
  selectorFamily,
  SetRecoilState,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { authorizationState } from '../auth/state';
import {
  getWorkingGroup,
  getWorkingGroups,
  putWorkingGroupResources,
} from './api';

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
  const [refresh, setRefresh] = useRecoilState(refreshWorkingGroupsState);
  const setWorkingGroupItem = useSetRecoilState(setWorkingGroup);
  return (workingGroup: gp2.WorkingGroupResponse) => {
    setWorkingGroupItem(workingGroup);
    setRefresh(refresh + 1);
  };
};

const setWorkingGroup = selector<gp2.WorkingGroupResponse>({
  key: 'setWorkingGroup',
  set: (
    { set }: { set: SetRecoilState },
    workingGroup: gp2.WorkingGroupResponse,
  ) => {
    set(workingGroupState(workingGroup.id), workingGroup);
  },
} as unknown as ReadWriteSelectorOptions<gp2.WorkingGroupResponse>);
