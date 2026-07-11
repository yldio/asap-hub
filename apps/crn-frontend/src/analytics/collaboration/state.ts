import { normalizeListOptions } from '@asap-hub/frontend-utils';
import {
  ListTeamCollaborationResponse,
  ListUserCollaborationResponse,
  SortSharingPrelimFindings,
  SortTeamCollaboration,
  SortUserCollaboration,
  TeamCollaborationPerformance,
  UserCollaborationPerformance,
  ListPreliminaryDataSharingResponse,
  PreliminaryDataSharingDataObject,
  ListSharingPrelimFindingsResponse,
  SharingPrelimFindingsResponse,
  LimitedTimeRangeOption,
  UserCollaborationResponse,
  TeamCollaborationResponse,
} from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AnalyticsSearchOptionsWithFiltering } from '../utils/analytics-options';
import { useAnalyticsOpensearch } from '../../hooks/opensearch';
import { makePerformanceQuery } from '../utils/state';
import {
  getUserCollaboration,
  getTeamCollaboration,
  getTeamCollaborationPerformance,
  getUserCollaborationPerformance,
  getPreliminaryDataSharing,
  PreliminaryDataSharingSearchOptions,
} from './api';

export const userCollaborationQueryKeys = {
  all: ['analytics-user-collaboration'] as const,
  lists: () => [...userCollaborationQueryKeys.all, 'list'] as const,
  list: (options: AnalyticsSearchOptionsWithFiltering<SortUserCollaboration>) =>
    [
      ...userCollaborationQueryKeys.lists(),
      normalizeListOptions(options),
    ] as const,
};

export const teamCollaborationQueryKeys = {
  all: ['analytics-team-collaboration'] as const,
  lists: () => [...teamCollaborationQueryKeys.all, 'list'] as const,
  list: (options: AnalyticsSearchOptionsWithFiltering<SortTeamCollaboration>) =>
    [
      ...teamCollaborationQueryKeys.lists(),
      normalizeListOptions(options),
    ] as const,
};

export const prelimDataSharingQueryKeys = {
  all: ['analytics-preliminary-data-sharing'] as const,
  lists: () => [...prelimDataSharingQueryKeys.all, 'list'] as const,
  list: (options: PreliminaryDataSharingSearchOptions) =>
    [
      ...prelimDataSharingQueryKeys.lists(),
      normalizeListOptions(options),
    ] as const,
};

export const useAnalyticsUserCollaboration = (
  options: AnalyticsSearchOptionsWithFiltering<SortUserCollaboration>,
): ListUserCollaborationResponse => {
  const opensearchClient =
    useAnalyticsOpensearch<UserCollaborationResponse>(
      'user-collaboration',
    ).client;

  return useSuspenseQuery({
    queryKey: userCollaborationQueryKeys.list(options),
    queryFn: async (): Promise<ListUserCollaborationResponse> => {
      try {
        return await getUserCollaboration(opensearchClient, options);
      } catch (error) {
        // Errors re-throw to the error boundary; non-Error rejections
        // become an empty list.
        if (error instanceof Error) {
          throw error;
        }
        return { total: 0, items: [] };
      }
    },
  }).data;
};

export const useAnalyticsTeamCollaboration = (
  options: AnalyticsSearchOptionsWithFiltering<SortTeamCollaboration>,
): ListTeamCollaborationResponse => {
  const opensearchClient =
    useAnalyticsOpensearch<TeamCollaborationResponse>(
      'team-collaboration',
    ).client;

  return useSuspenseQuery({
    queryKey: teamCollaborationQueryKeys.list(options),
    queryFn: async (): Promise<ListTeamCollaborationResponse> => {
      try {
        return await getTeamCollaboration(opensearchClient, options);
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        return { total: 0, items: [] };
      }
    },
  }).data;
};

const teamCollaborationPerformanceQuery =
  makePerformanceQuery<TeamCollaborationPerformance>(
    'team-collaboration-performance',
  );

export const useTeamCollaborationPerformance =
  teamCollaborationPerformanceQuery.useSuspenseHook(
    getTeamCollaborationPerformance,
    'team-collaboration-performance',
  );

export const useTeamCollaborationPerformanceValue =
  teamCollaborationPerformanceQuery.useValueHook;

const userCollaborationPerformanceQuery =
  makePerformanceQuery<UserCollaborationPerformance>(
    'user-collaboration-performance',
  );

export const useUserCollaborationPerformance =
  userCollaborationPerformanceQuery.useSuspenseHook(
    getUserCollaborationPerformance,
    'user-collaboration-performance',
  );

export const useUserCollaborationPerformanceValue =
  userCollaborationPerformanceQuery.useValueHook;

export const useAnalyticsSharingPrelimFindings = (
  options: Omit<
    AnalyticsSearchOptionsWithFiltering<SortSharingPrelimFindings>,
    'timeRange'
  > & {
    timeRange: LimitedTimeRangeOption;
  },
): ListSharingPrelimFindingsResponse => {
  const opensearchClient =
    useAnalyticsOpensearch<PreliminaryDataSharingDataObject>(
      'preliminary-data-sharing',
    ).client;

  // Cache identity depends on exactly these option fields.
  const stateOptions: PreliminaryDataSharingSearchOptions = {
    currentPage: options.currentPage,
    pageSize: options.pageSize,
    tags: options.tags,
    timeRange: options.timeRange,
    sort: options.sort,
  };

  const { data } = useSuspenseQuery({
    queryKey: prelimDataSharingQueryKeys.list(stateOptions),
    queryFn: async () => {
      try {
        // a queryFn must never return undefined — cache `null` instead
        return (
          (await getPreliminaryDataSharing(opensearchClient, stateOptions)) ??
          null
        );
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        return { total: 0, items: [] };
      }
    },
  });
  const preliminaryDataSharing = data as ListPreliminaryDataSharingResponse;

  const transformedItems: SharingPrelimFindingsResponse[] =
    preliminaryDataSharing.items.map((item) => ({
      teamId: item.teamId,
      teamName: item.teamName,
      isTeamInactive: item.isTeamInactive,
      teamPercentShared: item.percentShared,
      limitedData: item.limitedData,
      timeRange: item.timeRange,
    }));

  return {
    items: transformedItems,
    total: preliminaryDataSharing.total,
  };
};
