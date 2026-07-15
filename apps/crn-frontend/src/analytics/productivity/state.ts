import {
  normalizeListOptions,
  withEmptyListFallback,
} from '@asap-hub/frontend-utils';
import {
  ListTeamProductivityResponse,
  ListUserProductivityResponse,
  SortTeamProductivity,
  SortUserProductivity,
  TeamProductivityPerformance,
  TeamProductivityResponse,
  UserProductivityPerformance,
  UserProductivityResponse,
} from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AnalyticsSearchOptionsWithFiltering } from '../utils/analytics-options';
import { useAnalyticsOpensearch } from '../../hooks/opensearch';
import { makePerformanceQuery } from '../utils/state';
import {
  getTeamProductivity,
  getTeamProductivityPerformance,
  getUserProductivity,
  getUserProductivityPerformance,
} from './api';

export const userProductivityQueryKeys = {
  all: ['analytics-user-productivity'] as const,
  lists: () => [...userProductivityQueryKeys.all, 'list'] as const,
  list: (options: AnalyticsSearchOptionsWithFiltering<SortUserProductivity>) =>
    [
      ...userProductivityQueryKeys.lists(),
      normalizeListOptions(options),
    ] as const,
};

export const teamProductivityQueryKeys = {
  all: ['analytics-team-productivity'] as const,
  lists: () => [...teamProductivityQueryKeys.all, 'list'] as const,
  list: (options: AnalyticsSearchOptionsWithFiltering<SortTeamProductivity>) =>
    [
      ...teamProductivityQueryKeys.lists(),
      normalizeListOptions(options),
    ] as const,
};

export const useAnalyticsUserProductivity = (
  options: AnalyticsSearchOptionsWithFiltering<SortUserProductivity>,
): ListUserProductivityResponse => {
  const opensearchClient =
    useAnalyticsOpensearch<UserProductivityResponse>(
      'user-productivity',
    ).client;

  return useSuspenseQuery({
    queryKey: userProductivityQueryKeys.list(options),
    queryFn: (): Promise<ListUserProductivityResponse> =>
      withEmptyListFallback(
        () => getUserProductivity(opensearchClient, options),
        { total: 0, items: [] },
      ),
  }).data;
};

const userProductivityPerformanceQuery =
  makePerformanceQuery<UserProductivityPerformance>(
    'user-productivity-performance',
  );

export const useUserProductivityPerformance =
  userProductivityPerformanceQuery.useSuspenseHook(
    getUserProductivityPerformance,
    'user-productivity-performance',
  );

export const useUserProductivityPerformanceValue =
  userProductivityPerformanceQuery.useValueHook;

const teamProductivityPerformanceQuery =
  makePerformanceQuery<TeamProductivityPerformance>(
    'team-productivity-performance',
  );

export const useTeamProductivityPerformance =
  teamProductivityPerformanceQuery.useSuspenseHook(
    getTeamProductivityPerformance,
    'team-productivity-performance',
  );

export const useTeamProductivityPerformanceValue =
  teamProductivityPerformanceQuery.useValueHook;

export const useAnalyticsTeamProductivity = (
  options: AnalyticsSearchOptionsWithFiltering<SortTeamProductivity>,
): ListTeamProductivityResponse => {
  const opensearchClient =
    useAnalyticsOpensearch<TeamProductivityResponse>(
      'team-productivity',
    ).client;

  return useSuspenseQuery({
    queryKey: teamProductivityQueryKeys.list(options),
    queryFn: (): Promise<ListTeamProductivityResponse> =>
      withEmptyListFallback(
        () => getTeamProductivity(opensearchClient, options),
        { total: 0, items: [] },
      ),
  }).data;
};
