import useDeepCompareEffect from 'use-deep-compare-effect';
import {
  atomFamily,
  selectorFamily,
  DefaultValue,
  useRecoilValue,
  useRecoilState,
} from 'recoil';
import { ListEventResponse, EventResponse } from '@asap-hub/model';

import { GetEventListOptions } from '../../../events/options';
import { eventState } from '../../../events/state';
import { authorizationState } from '../../../auth/state';
import { getGroupEvents } from './api';

const groupEventIndexState = atomFamily<
  | { ids: ReadonlyArray<string>; total: number }
  | Error
  | 'noSuchGroup'
  | undefined,
  GetEventListOptions
>({
  key: 'groupEventIndex',
  default: undefined,
});

export const groupEventsState = selectorFamily<
  ListEventResponse | Error | 'noSuchGroup' | undefined,
  GetEventListOptions & { groupId: string }
>({
  key: 'groupEvents',
  get:
    (options) =>
    ({ get }) => {
      const index = get(groupEventIndexState(options));
      if (
        index === undefined ||
        index === 'noSuchGroup' ||
        index instanceof Error
      )
        return index;
      const events: EventResponse[] = [];
      for (const id of index.ids) {
        const event = get(eventState(id));
        if (event === undefined) return undefined;
        events.push(event);
      }
      return { total: index.total, items: events };
    },
  set:
    (options) =>
    ({ get, set, reset }, newEvents) => {
      if (newEvents === undefined || newEvents instanceof DefaultValue) {
        const oldEvents = get(groupEventIndexState(options));
        if (
          !(
            oldEvents === undefined ||
            oldEvents === 'noSuchGroup' ||
            oldEvents instanceof Error
          )
        ) {
          oldEvents.ids.forEach((id) => reset(eventState(id)));
        }
        reset(groupEventIndexState(options));
      } else if (newEvents instanceof Error || newEvents === 'noSuchGroup') {
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

export const usePrefetchGroupEvents = (
  groupId: string,
  options: GetEventListOptions,
) => {
  const authorization = useRecoilValue(authorizationState);
  const [groupEvents, setGroupEvents] = useRecoilState(
    groupEventsState({ ...options, groupId }),
  );
  useDeepCompareEffect(() => {
    if (groupEvents === undefined) {
      getGroupEvents(groupId, options, authorization)
        .then((newGroupEvents) =>
          setGroupEvents(newGroupEvents ?? 'noSuchGroup'),
        )
        .catch();
    }
  }, [authorization, groupEvents, groupId, options, setGroupEvents]);
};
export const useGroupEvents = (
  groupId: string,
  options: GetEventListOptions,
) => {
  const authorization = useRecoilValue(authorizationState);
  const [groupEvents, setGroupEvents] = useRecoilState(
    groupEventsState({ ...options, groupId }),
  );
  if (groupEvents === undefined) {
    throw getGroupEvents(groupId, options, authorization)
      .then((newGroupEvents) => setGroupEvents(newGroupEvents ?? 'noSuchGroup'))
      .catch(setGroupEvents);
  }
  if (groupEvents instanceof Error) {
    throw groupEvents;
  }
  return groupEvents;
};
