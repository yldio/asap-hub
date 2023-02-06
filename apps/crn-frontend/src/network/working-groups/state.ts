import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  WorkingGroupListResponse,
  WorkingGroupResponse,
  WorkingGroupDataObject,
} from '@asap-hub/model';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { hasWorkingGroupsCreateUpdateResearchOutputPermissions } from '@asap-hub/validation';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { authorizationState } from '../../auth/state';
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
        const group = get(workingGroupState(id));
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
        const oldWorkingGroups = get(workingGroupIndexState(options));
        if (!(oldWorkingGroups instanceof Error)) {
          oldWorkingGroups?.ids?.forEach((id) => reset(workingGroupState(id)));
        }
        reset(workingGroupIndexState(options));
      } else if (newWorkingGroups instanceof Error) {
        set(workingGroupIndexState(options), newWorkingGroups);
      } else {
        newWorkingGroups?.items.forEach((workingGroup) =>
          set(workingGroupState(workingGroup.id), workingGroup),
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

export const useWorkingGroupById = (id: string) =>
  useRecoilValue(workingGroupState(id));

export const usePrefetchWorkingGroups = (options: GetListOptions) => {
  const authorization = useRecoilValue(authorizationState);
  const [workingGroups, setWorkingGroups] = useRecoilState(
    workingGroupsState(options),
  );
  useDeepCompareEffect(() => {
    if (workingGroups === undefined) {
      getWorkingGroups(options, authorization).then(setWorkingGroups).catch();
    }
  }, [authorization, workingGroups, options, setWorkingGroups]);
};

export const useWorkingGroups = (options: GetListOptions) => {
  const authorization = useRecoilValue(authorizationState);
  const [workingGroups, setWorkingGroups] = useRecoilState(
    workingGroupsState(options),
  );
  if (workingGroups === undefined) {
    throw getWorkingGroups(options, authorization)
      .then(setWorkingGroups)
      .catch(setWorkingGroups);
  }
  if (workingGroups instanceof Error) {
    throw workingGroups;
  }
  return workingGroups;
};

export const useCanCreateUpdateResearchOutput = (
  workingGroup: WorkingGroupDataObject | undefined,
): boolean => {
  const user = useCurrentUserCRN();

  if (user === null) return false;

  return hasWorkingGroupsCreateUpdateResearchOutputPermissions(
    user,
    workingGroup,
  );
};
