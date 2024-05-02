import {
  ListUserCollaborationResponse,
  UserCollaborationResponse,
} from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { authorizationState } from '../../auth/state';
import { CollaborationListOptions, getUserCollaboration } from './api';

const analyticsUserCollaborationIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  CollaborationListOptions
>({
  key: 'analyticsUserCollaborationIndex',
  default: undefined,
});

export const analyticsUserCollaborationListState = atomFamily<
  UserCollaborationResponse | undefined,
  string
>({
  key: 'analyticsUserCollaborationList',
  default: undefined,
});

export const analyticsUserCollaborationState = selectorFamily<
  ListUserCollaborationResponse | Error | undefined,
  CollaborationListOptions
>({
  key: 'userCollaboration',
  get:
    (options) =>
    ({ get }) => {
      const index = get(analyticsUserCollaborationIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const users: UserCollaborationResponse[] = [];
      for (const id of index.ids) {
        const user = get(analyticsUserCollaborationListState(id));
        if (user === undefined) return undefined;
        users.push(user);
      }
      return { total: index.total, items: users };
    },
  set:
    (options) =>
    ({ get, set, reset }, newUserCollaboration) => {
      if (
        newUserCollaboration === undefined ||
        newUserCollaboration instanceof DefaultValue
      ) {
        reset(analyticsUserCollaborationIndexState(options));
      } else if (newUserCollaboration instanceof Error) {
        set(
          analyticsUserCollaborationIndexState(options),
          newUserCollaboration,
        );
      } else {
        newUserCollaboration?.items.forEach((userCollaboration) =>
          set(
            analyticsUserCollaborationListState(userCollaboration.id),
            userCollaboration,
          ),
        );
        set(analyticsUserCollaborationIndexState(options), {
          total: newUserCollaboration.total,
          ids: newUserCollaboration.items.map(
            (userCollaboration) => userCollaboration.id,
          ),
        });
      }
    },
});

export const useAnalyticsUserCollaboration = (
  options: CollaborationListOptions,
) => {
  const authorization = useRecoilValue(authorizationState);
  const [userCollaboration, setUserCollaboration] = useRecoilState(
    analyticsUserCollaborationState(options),
  );
  if (userCollaboration === undefined) {
    throw getUserCollaboration(options, authorization)
      .then(setUserCollaboration)
      .catch(setUserCollaboration);
  }
  if (userCollaboration instanceof Error) {
    throw userCollaboration;
  }
  return userCollaboration;
};
