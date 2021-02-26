import {
  useRecoilValue,
  useRecoilState,
  atomFamily,
  selectorFamily,
  DefaultValue,
} from 'recoil';
import {
  ListGroupResponse,
  GroupResponse,
  EventResponse,
  ListEventResponse,
} from '@asap-hub/model';

import { authorizationState } from '@asap-hub/frontend/src/auth/state';
import { GetListOptions } from '@asap-hub/frontend/src/api-util';
import { getGroups, getGroup, getGroupEvents } from './api';
import { BeforeOrAfter } from '../../events/api';
import { eventState } from '../../events/state';

const groupIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  GetListOptions
>({
  key: 'groupIndex',
  default: undefined,
});
export const groupsState = selectorFamily<
  ListGroupResponse | Error | undefined,
  GetListOptions
>({
  key: 'groups',
  get: (options) => ({ get }) => {
    const index = get(groupIndexState(options));
    if (index === undefined || index instanceof Error) return index;
    const groups: GroupResponse[] = [];
    for (const id of index.ids) {
      const group = get(groupState(id));
      if (group === undefined) return undefined;
      groups.push(group);
    }
    return { total: index.total, items: groups };
  },
  set: (options) => ({ get, set, reset }, newGroups) => {
    if (newGroups === undefined || newGroups instanceof DefaultValue) {
      const oldGroups = get(groupIndexState(options));
      if (!(oldGroups instanceof Error)) {
        oldGroups?.ids?.forEach((id) => reset(groupState(id)));
      }
      reset(groupIndexState(options));
    } else if (newGroups instanceof Error) {
      set(groupIndexState(options), newGroups);
    } else {
      newGroups?.items.forEach((group) => set(groupState(group.id), group));
      set(groupIndexState(options), {
        total: newGroups.total,
        ids: newGroups.items.map((group) => group.id),
      });
    }
  },
});
const groupEventIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  GetListOptions & BeforeOrAfter
>({
  key: 'groupEventIndex',
  default: undefined,
});

export const groupEventsState = selectorFamily<
  ListEventResponse | Error | undefined,
  GetListOptions & BeforeOrAfter & { id: string }
>({
  key: 'groupEvents',
  get: (options) => ({ get }) => {
    const index = get(groupEventIndexState(options));
    if (index === undefined || index instanceof Error) return index;
    const events: EventResponse[] = [];
    for (const id of index.ids) {
      const event = get(eventState(id));
      if (event === undefined) return undefined;
      events.push(event);
    }
    return { total: index.total, items: events };
  },
  set: (options) => ({ get, set, reset }, newEvents) => {
    if (newEvents === undefined || newEvents instanceof DefaultValue) {
      const oldEvents = get(groupEventIndexState(options));
      if (!(oldEvents instanceof Error)) {
        oldEvents?.ids?.forEach((id) => reset(eventState(id)));
      }
      reset(groupEventIndexState(options));
    } else if (newEvents instanceof Error) {
      set(groupEventIndexState(options), newEvents);
    } else {
      newEvents?.items.forEach((event) => set(eventState(event.id), event));
      set(groupEventIndexState(options), {
        total: newEvents.total,
        ids: newEvents.items.map((event) => event.id),
      });
    }
  },
});

export const refreshGroupState = atomFamily<number, string>({
  key: 'refreshGroup',
  default: 0,
});
const fetchGroupState = selectorFamily<GroupResponse | undefined, string>({
  key: 'fetchGroup',
  get: (id) => async ({ get }) => {
    get(refreshGroupState(id));
    const authorization = get(authorizationState);
    return getGroup(id, authorization);
  },
});
const groupState = atomFamily<GroupResponse | undefined, string>({
  key: 'group',
  default: fetchGroupState,
});

export const useGroups = (options: GetListOptions) => {
  const authorization = useRecoilValue(authorizationState);
  const [groups, setGroups] = useRecoilState(groupsState(options));
  if (groups === undefined) {
    throw getGroups(options, authorization).then(setGroups).catch(setGroups);
  }
  if (groups instanceof Error) {
    throw groups;
  }
  return groups;
};

export const useGroupEvents = (
  id: string,
  options: GetListOptions & BeforeOrAfter,
) => {
  const authorization = useRecoilValue(authorizationState);
  const [groupEvents, setGroupEvents] = useRecoilState(
    groupEventsState({ ...options, id }),
  );
  if (groupEvents === undefined) {
    throw getGroupEvents(id, options, authorization)
      .then(setGroupEvents)
      .catch(setGroupEvents);
  }
  if (groupEvents instanceof Error) {
    throw groupEvents;
  }
  return groupEvents;
};

export const useGroupById = (id: string) => useRecoilValue(groupState(id));
