import { authorizationState } from '@asap-hub/crn-frontend/src/auth/state';
import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  EventResponse,
  ListEventResponse,
  ListUserResponse,
  UserPatchRequest,
  UserResponse,
} from '@asap-hub/model';
import { useAuth0 } from '@asap-hub/react-context';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { getEvent, getEvents } from '../../events/api';
import { refreshEventState } from '../../events/state';
import { useAlgolia } from '../../hooks/algolia';
import { getUser, getUsers, patchUser, postUserAvatar } from './api';
import { GetEventListOptions } from './options';

const userIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  GetListOptions
>({
  key: 'userIndex',
  default: undefined,
});
export const usersState = selectorFamily<
  ListUserResponse | Error | undefined,
  GetListOptions
>({
  key: 'users',
  get:
    (options) =>
    ({ get }) => {
      const index = get(userIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const users: UserResponse[] = [];
      for (const id of index.ids) {
        const user = get(userState(id));
        if (user === undefined) return undefined;
        users.push(user);
      }
      return { total: index.total, items: users };
    },
  set:
    (options) =>
    ({ get, set, reset }, newUsers) => {
      if (newUsers === undefined || newUsers instanceof DefaultValue) {
        const oldUsers = get(userIndexState(options));
        if (!(oldUsers instanceof Error)) {
          oldUsers?.ids?.forEach((id) => reset(patchedUserState(id)));
        }
        reset(userIndexState(options));
      } else if (newUsers instanceof Error) {
        set(userIndexState(options), newUsers);
      } else {
        newUsers?.items.forEach((user) => set(patchedUserState(user.id), user));
        set(userIndexState(options), {
          total: newUsers.total,
          ids: newUsers.items.map((user) => user.id),
        });
      }
    },
});

export const refreshUserState = atomFamily<number, string>({
  key: 'refreshUser',
  default: 0,
});
const initialUserState = selectorFamily<UserResponse | undefined, string>({
  key: 'initialUser',
  get:
    (id) =>
    async ({ get }) => {
      get(refreshUserState(id));
      const authorization = get(authorizationState);
      return getUser(id, authorization);
    },
});

const patchedUserState = atomFamily<UserResponse | undefined, string>({
  key: 'patchedUser',
  default: undefined,
});

const userState = selectorFamily<UserResponse | undefined, string>({
  key: 'user',
  get:
    (id) =>
    ({ get }) =>
      get(patchedUserState(id)) ?? get(initialUserState(id)),
});

export const useUsers = (options: GetListOptions) => {
  const [users, setUsers] = useRecoilState(usersState(options));
  const algoliaClient = useAlgolia();
  if (users === undefined) {
    throw getUsers(algoliaClient.client, options)
      .then(setUsers)
      .catch(setUsers);
  }
  if (users instanceof Error) {
    throw users;
  }
  return users;
};

export const useUserById = (id: string) => useRecoilValue(userState(id));

export const usePatchUserById = (id: string) => {
  const { getTokenSilently } = useAuth0();
  const authorization = useRecoilValue(authorizationState);
  const setPatchedUser = useSetRecoilState(patchedUserState(id));
  return async (patch: UserPatchRequest) => {
    setPatchedUser(await patchUser(id, patch, authorization));
    await getTokenSilently({
      redirect_uri: window.location.origin,
      ignoreCache: true,
    });
  };
};

export const usePatchUserAvatarById = (id: string) => {
  const { getTokenSilently } = useAuth0();
  const authorization = useRecoilValue(authorizationState);
  const setSetPatchedUserState = useSetRecoilState(patchedUserState(id));
  return async (avatar: string) => {
    const user = await postUserAvatar(id, { avatar }, authorization);
    await getTokenSilently({
      redirect_uri: window.location.origin,
      ignoreCache: true,
    });

    setSetPatchedUserState(user);
  };
};
const fetchEventState = selectorFamily<EventResponse | undefined, string>({
  key: 'fetchEvent1',
  get:
    (id) =>
    async ({ get }) => {
      get(refreshEventState(id));
      const authorization = get(authorizationState);
      return getEvent(id, authorization);
    },
});
export const eventState = atomFamily<EventResponse | undefined, string>({
  key: 'event1',
  default: fetchEventState,
});

const eventIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  GetEventListOptions
>({
  key: 'eventIndex1',
  default: undefined,
});
export const eventsState = selectorFamily<
  ListEventResponse | Error | undefined,
  GetEventListOptions
>({
  key: 'events1',
  get:
    (options) =>
    ({ get }) => {
      const index = get(eventIndexState(options));
      if (index === undefined || index instanceof Error) return index;
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
        const oldEvents = get(eventIndexState(options));
        if (!(oldEvents instanceof Error)) {
          oldEvents?.ids?.forEach((id) => reset(eventState(id)));
        }
        reset(eventIndexState(options));
      } else if (newEvents instanceof Error) {
        set(eventIndexState(options), newEvents);
      } else {
        newEvents?.items.forEach((event) => set(eventState(event.id), event));
        set(eventIndexState(options), {
          total: newEvents.total,
          ids: newEvents.items.map((event) => event.id),
        });
      }
    },
});
export const usePrefetchEvents = (options: GetEventListOptions) => {
  const authorization = useRecoilValue(authorizationState);
  const [events, setEvents] = useRecoilState(eventsState(options));
  useDeepCompareEffect(() => {
    if (events === undefined) {
      getEvents(options, authorization).then(setEvents).catch();
    }
  }, [authorization, events, options, setEvents]);
};
export const useEvents = (options: GetEventListOptions) => {
  const authorization = useRecoilValue(authorizationState);
  const [events, setEvents] = useRecoilState(eventsState(options));
  if (events === undefined) {
    throw getEvents(options, authorization).then(setEvents).catch(setEvents);
  }
  if (events instanceof Error) {
    throw events;
  }
  return events;
};
