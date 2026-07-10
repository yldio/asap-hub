import { normalizeListOptions } from '@asap-hub/frontend-utils';
import {
  EngagementPerformance,
  EngagementResponse,
  ListEngagementResponse,
  ListMeetingRepAttendanceResponse,
  MeetingRepAttendanceDataObject,
  SortEngagement,
} from '@asap-hub/model';
import { useSuspenseQuery } from '@tanstack/react-query';

import { AnalyticsSearchOptionsWithFiltering } from '../utils/analytics-options';
import { useAnalyticsOpensearch } from '../../hooks';
import { makePerformanceQuery } from '../utils/state';
import {
  getEngagement,
  getEngagementPerformance,
  getMeetingRepAttendance,
  MeetingRepAttendanceOptions,
} from './api';

export const engagementQueryKeys = {
  all: ['analytics-engagement'] as const,
  lists: () => [...engagementQueryKeys.all, 'list'] as const,
  list: (options: AnalyticsSearchOptionsWithFiltering<SortEngagement>) =>
    [...engagementQueryKeys.lists(), normalizeListOptions(options)] as const,
};

export const meetingRepAttendanceQueryKeys = {
  all: ['analytics-meeting-rep-attendance'] as const,
  lists: () => [...meetingRepAttendanceQueryKeys.all, 'list'] as const,
  list: (options: MeetingRepAttendanceOptions) =>
    [
      ...meetingRepAttendanceQueryKeys.lists(),
      normalizeListOptions(options),
    ] as const,
};

export const useAnalyticsEngagement = (
  options: AnalyticsSearchOptionsWithFiltering<SortEngagement>,
): ListEngagementResponse => {
  const opensearchClient = useAnalyticsOpensearch<EngagementResponse>(
    'presenter-representation',
  ).client;

  return useSuspenseQuery({
    queryKey: engagementQueryKeys.list(options),
    queryFn: async (): Promise<ListEngagementResponse> => {
      try {
        return await getEngagement(opensearchClient, options);
      } catch (error) {
        // Preserved from the recoil hook's `.catch(setEngagement)`: an Error
        // rejection was cached and re-thrown to the error boundary, while a
        // non-Error rejection was swallowed. Map non-Errors to an empty list.
        if (error instanceof Error) {
          throw error;
        }
        return { total: 0, items: [] };
      }
    },
  }).data;
};

const engagementPerformanceQuery = makePerformanceQuery<EngagementPerformance>(
  'presenter-representation-performance',
);

export const useEngagementPerformance =
  engagementPerformanceQuery.useSuspenseHook(
    getEngagementPerformance,
    'presenter-representation-performance',
  );

export const useEngagementPerformanceValue =
  engagementPerformanceQuery.useValueHook;

export const useAnalyticsMeetingRepAttendance = (
  options: MeetingRepAttendanceOptions,
): ListMeetingRepAttendanceResponse => {
  const opensearchClient =
    useAnalyticsOpensearch<MeetingRepAttendanceDataObject>('attendance').client;

  // The recoil atomFamily was keyed by this Pick of the options — keep the
  // same key surface so cache identity is unchanged.
  const stateOptions: MeetingRepAttendanceOptions = {
    currentPage: options.currentPage,
    pageSize: options.pageSize,
    tags: options.tags,
    timeRange: options.timeRange,
    sort: options.sort,
  };

  const { data } = useSuspenseQuery({
    queryKey: meetingRepAttendanceQueryKeys.list(stateOptions),
    queryFn: async () => {
      try {
        // getMeetingRepAttendance is typed `| undefined`; a queryFn must
        // never return undefined — cache `null` (recoil would have re-thrown
        // forever on undefined; unreachable in practice).
        return (
          (await getMeetingRepAttendance(opensearchClient, stateOptions)) ??
          null
        );
      } catch (error) {
        // Preserved from the recoil hook's `.catch(setMeetingRepAttendance)`
        // — see useAnalyticsEngagement above.
        if (error instanceof Error) {
          throw error;
        }
        return { total: 0, items: [] };
      }
    },
  });
  return data as ListMeetingRepAttendanceResponse;
};
