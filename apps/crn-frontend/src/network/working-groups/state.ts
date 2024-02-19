import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  WorkingGroupListResponse,
  WorkingGroupResponse,
} from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { authorizationState } from '../../auth/state';
import { useAlgolia } from '../../hooks/algolia';
import { getWorkingGroup, getWorkingGroups } from './api';

const workingGroupIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  GetListOptions
>({
  key: 'workingGroupIndex',
  default: undefined,
});

export const workingGroupsState = selectorFamily<
  WorkingGroupListResponse | Error | undefined,
  GetListOptions
>({
  key: 'workingGroups',
  get:
    (options) =>
    ({ get }) => {
      const index = get(workingGroupIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const workingGroups: WorkingGroupResponse[] = [];
      for (const id of index.ids) {
        const group = get(workingGroupListState(id));
        if (group === undefined) return undefined;
        workingGroups.push(group);
      }
      return { total: index.total, items: workingGroups };
    },
  set:
    (options) =>
    ({ get, set, reset }, newWorkingGroups) => {
      if (
        newWorkingGroups === undefined ||
        newWorkingGroups instanceof DefaultValue
      ) {
        reset(workingGroupIndexState(options));
      } else if (newWorkingGroups instanceof Error) {
        set(workingGroupIndexState(options), newWorkingGroups);
      } else {
        newWorkingGroups?.items.forEach((workingGroup) =>
          set(workingGroupListState(workingGroup.id), workingGroup),
        );
        set(workingGroupIndexState(options), {
          total: newWorkingGroups.total,
          ids: newWorkingGroups.items.map((group) => group.id),
        });
      }
    },
});

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
export const workingGroupListState = atomFamily<
  WorkingGroupResponse | undefined,
  string
>({
  key: 'workingGroupList',
  default: workingGroupState,
});

export const useWorkingGroupById = (id: string) =>
  useRecoilValue(workingGroupState(id));

export const usePrefetchWorkingGroups = (options: GetListOptions) => {
  const algoliaClient = useAlgolia();

  const [workingGroups, setWorkingGroups] = useRecoilState(
    workingGroupsState(options),
  );
  useDeepCompareEffect(() => {
    if (workingGroups === undefined) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getWorkingGroups(algoliaClient.client, options)
        .then(setWorkingGroups)
        .catch();
    }
  }, [workingGroups, options, setWorkingGroups]);
};

export const useWorkingGroups = (options: GetListOptions) => {
  const [workingGroups, setWorkingGroups] = useRecoilState(
    workingGroupsState(options),
  );
  const algoliaClient = useAlgolia();

  if (workingGroups === undefined) {
    throw getWorkingGroups(algoliaClient.client, options)
      .then(setWorkingGroups)
      .catch(setWorkingGroups);
  }
  if (workingGroups instanceof Error) {
    throw workingGroups;
  }
  return workingGroups;
};
