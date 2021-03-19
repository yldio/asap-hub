import {
  atomFamily,
  selectorFamily,
  DefaultValue,
  useRecoilValue,
  useRecoilState,
} from 'recoil';
import { ListEventResponse, EventResponse } from '@asap-hub/model';

import { GetListOptions } from '@asap-hub/frontend/src/api-util';
import { BeforeOrAfter } from '@asap-hub/frontend/src/events/api';
import { eventState } from '@asap-hub/frontend/src/events/state';
import { authorizationState } from '@asap-hub/frontend/src/auth/state';
import { getGroupEvents } from './api';

const groupEventIndexState = atomFamily<
  | { ids: ReadonlyArray<string>; total: number }
  | Error
  | 'noSuchGroup'
  | undefined,
  GetListOptions & BeforeOrAfter
>({
  key: 'groupEventIndex',
  default: undefined,
});

export const groupEventsState = selectorFamily<
  ListEventResponse | Error | 'noSuchGroup' | undefined,
  GetListOptions & BeforeOrAfter & { groupId: string }
>({
  key: 'groupEvents',
  get: (options) => ({ get }) => {
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
  set: (options) => ({ get, set, reset }, newEvents) => {
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

export const useGroupEvents = (
  id: string,
  options: GetListOptions & BeforeOrAfter,
) => {
  const authorization = useRecoilValue(authorizationState);
  const [groupEvents, setGroupEvents] = useRecoilState(
    groupEventsState({ ...options, groupId: id }),
  );
  if (groupEvents === undefined) {
    throw getGroupEvents(id, options, authorization)
      .then((newGroupEvents) => setGroupEvents(newGroupEvents ?? 'noSuchGroup'))
      .catch(setGroupEvents);
  }
  if (groupEvents instanceof Error) {
    throw groupEvents;
  }
  return groupEvents;
};
