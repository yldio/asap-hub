import { AnalyticsSearchOptionsWithRange } from '@asap-hub/algolia';
import {
  ListTeamCollaborationAlgoliaResponse,
  ListUserCollaborationAlgoliaResponse,
  TeamCollaborationAlgoliaResponse,
  TeamCollaborationPerformance,
  TimeRangeOption,
  UserCollaborationAlgoliaResponse,
} from '@asap-hub/model';
import { useEffect } from 'react';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useResetRecoilState,
} from 'recoil';
import { ANALYTICS_ALGOLIA_INDEX } from '../../config';
import { useAnalyticsAlgolia } from '../../hooks/algolia';
import { makePerformanceHook, makePerformanceState } from '../utils/state';
import {
  CollaborationListOptions,
  getUserCollaboration,
  getTeamCollaboration,
  getTeamCollaborationPerformance,
} from './api';

const analyticsUserCollaborationIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  CollaborationListOptions
>({
  key: 'analyticsUserCollaborationIndex',
  default: undefined,
});

export const analyticsUserCollaborationListState = atomFamily<
  UserCollaborationAlgoliaResponse | undefined,
  string
>({
  key: 'analyticsUserCollaborationList',
  default: undefined,
});

export const analyticsUserCollaborationState = selectorFamily<
  ListUserCollaborationAlgoliaResponse | Error | undefined,
  CollaborationListOptions
>({
  key: 'userCollaboration',
  get:
    (options) =>
    ({ get }) => {
      const index = get(analyticsUserCollaborationIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const users: UserCollaborationAlgoliaResponse[] = [];
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
  options: AnalyticsSearchOptionsWithRange,
) => {
  const algoliaClient = useAnalyticsAlgolia(ANALYTICS_ALGOLIA_INDEX);
  const [userCollaboration, setUserCollaboration] = useRecoilState(
    analyticsUserCollaborationState(options),
  );

  const resetUserCollaboration = useResetRecoilState(
    analyticsUserCollaborationState(options),
  );

  useEffect(() => {
    resetUserCollaboration(); // Reset state to force refetch on timeRange change
  }, [options.timeRange, resetUserCollaboration]);

  if (userCollaboration === undefined) {
    throw getUserCollaboration(algoliaClient.client, options)
      .then(setUserCollaboration)
      .catch(setUserCollaboration);
  }
  if (userCollaboration instanceof Error) {
    throw userCollaboration;
  }
  return userCollaboration;
};

export const analyticsTeamCollaborationIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  CollaborationListOptions
>({
  key: 'analyticsTeamCollaborationIndex',
  default: undefined,
});

export const analyticsTeamCollaborationListState = atomFamily<
  TeamCollaborationAlgoliaResponse | undefined,
  string
>({
  key: 'analyticsTeamCollaborationList',
  default: undefined,
});

export const analyticsTeamCollaborationState = selectorFamily<
  ListTeamCollaborationAlgoliaResponse | Error | undefined,
  CollaborationListOptions
>({
  key: 'teamCollaboration',
  get:
    (options) =>
    ({ get }) => {
      const index = get(analyticsTeamCollaborationIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const teams: TeamCollaborationAlgoliaResponse[] = [];
      for (const id of index.ids) {
        const team = get(analyticsTeamCollaborationListState(id));
        if (team === undefined) return undefined;
        teams.push(team);
      }
      return { total: index.total, items: teams };
    },
  set:
    (options) =>
    ({ get, set, reset }, newTeamCollaboration) => {
      if (
        newTeamCollaboration === undefined ||
        newTeamCollaboration instanceof DefaultValue
      ) {
        reset(analyticsTeamCollaborationIndexState(options));
      } else if (newTeamCollaboration instanceof Error) {
        set(
          analyticsTeamCollaborationIndexState(options),
          newTeamCollaboration,
        );
      } else {
        newTeamCollaboration?.items.forEach((teamCollaboration) =>
          set(
            analyticsTeamCollaborationListState(teamCollaboration.id),
            teamCollaboration,
          ),
        );
        set(analyticsTeamCollaborationIndexState(options), {
          total: newTeamCollaboration.total,
          ids: newTeamCollaboration.items.map(
            (teamCollaboration) => teamCollaboration.id,
          ),
        });
      }
    },
});

export const useAnalyticsTeamCollaboration = (
  options: AnalyticsSearchOptionsWithRange,
) => {
  const algoliaClient = useAnalyticsAlgolia(ANALYTICS_ALGOLIA_INDEX);
  const [teamCollaboration, setTeamCollaboration] = useRecoilState(
    analyticsTeamCollaborationState(options),
  );

  const resetTeamCollaboration = useResetRecoilState(
    analyticsTeamCollaborationState(options),
  );

  useEffect(() => {
    resetTeamCollaboration(); // Reset state to force refetch on timeRange change
  }, [options.timeRange, resetTeamCollaboration]);

  if (teamCollaboration === undefined) {
    throw getTeamCollaboration(algoliaClient.client, options)
      .then(setTeamCollaboration)
      .catch(setTeamCollaboration);
  }
  if (teamCollaboration instanceof Error) {
    throw teamCollaboration;
  }
  return teamCollaboration;
};

export const teamCollaborationPerformanceState =
  makePerformanceState<TeamCollaborationPerformance>(
    'analyticsTeamCollaborationPerformance',
  );

export const useTeamCollaborationPerformance =
  makePerformanceHook<TeamCollaborationPerformance>(
    teamCollaborationPerformanceState,
    getTeamCollaborationPerformance,
  );
