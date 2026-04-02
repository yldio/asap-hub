import { AnalyticsSearchOptionsWithFiltering } from '@asap-hub/algolia';
import {
  EngagementPerformance,
  EngagementResponse,
  ListEngagementResponse,
  ListMeetingRepAttendanceResponse,
  MeetingRepAttendanceDataObject,
  SortEngagement,
} from '@asap-hub/model';
import {
  atomFamily,
  DefaultValue,
  selectorFamily,
  useRecoilState,
  useRecoilValueLoadable,
} from 'recoil';

import { useAnalyticsOpensearch } from '../../hooks';
import {
  makeFlagBasedPerformanceHook,
  makePerformanceState,
} from '../utils/state';
import {
  EngagementListOptions,
  getEngagement,
  getEngagementPerformance,
  getMeetingRepAttendance,
  MeetingRepAttendanceOptions,
} from './api';

const analyticsEngagementIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  EngagementListOptions
>({
  key: 'analyticsEngagementIndex',
  default: undefined,
});

export const analyticsEngagementListState = atomFamily<
  EngagementResponse | undefined,
  string
>({
  key: 'analyticsEngagementList',
  default: undefined,
});

export const analyticsEngagementState = selectorFamily<
  ListEngagementResponse | Error | undefined,
  EngagementListOptions
>({
  key: 'engagement',
  get:
    (options) =>
    ({ get }) => {
      const index = get(analyticsEngagementIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const teams: EngagementResponse[] = [];
      for (const id of index.ids) {
        const team = get(analyticsEngagementListState(id));
        if (team === undefined) return undefined;
        teams.push(team);
      }
      return { total: index.total, items: teams };
    },
  set:
    (options) =>
    ({ get, set, reset }, newEngagement) => {
      if (
        newEngagement === undefined ||
        newEngagement instanceof DefaultValue
      ) {
        reset(analyticsEngagementIndexState(options));
      } else if (newEngagement instanceof Error) {
        set(analyticsEngagementIndexState(options), newEngagement);
      } else {
        newEngagement?.items.forEach((engagement) =>
          set(
            analyticsEngagementListState(
              engagement.id + JSON.stringify(options),
            ),
            engagement,
          ),
        );
        set(analyticsEngagementIndexState(options), {
          total: newEngagement.total,
          ids: newEngagement.items.map(
            (engagement) => engagement.id + JSON.stringify(options),
          ),
        });
      }
    },
});

export const useAnalyticsEngagement = (
  options: AnalyticsSearchOptionsWithFiltering<SortEngagement>,
) => {
  const opensearchClient = useAnalyticsOpensearch<EngagementResponse>(
    'presenter-representation',
  ).client;
  const [engagement, setEngagement] = useRecoilState(
    analyticsEngagementState(options),
  );

  if (engagement === undefined) {
    throw getEngagement(opensearchClient, options)
      .then(setEngagement)
      .catch(setEngagement);
  }
  if (engagement instanceof Error) {
    throw engagement;
  }
  return engagement;
};

export const engagementPerformanceState =
  makePerformanceState<EngagementPerformance>('analyticsEngagementPerformance');

export const useEngagementPerformance =
  makeFlagBasedPerformanceHook<EngagementPerformance>(
    engagementPerformanceState,
    getEngagementPerformance,
    'presenter-representation-performance',
  );

export const useEngagementPerformanceValue = (
  options: Parameters<typeof getEngagementPerformance>[1],
) => {
  const loadable = useRecoilValueLoadable(engagementPerformanceState(options));
  return loadable.state === 'hasValue' ? loadable.contents : undefined;
};

const analyticsMeetingRepAttendanceState = atomFamily<
  ListMeetingRepAttendanceResponse | Error | undefined,
  MeetingRepAttendanceOptions
>({
  key: 'analyticsMeetingRepAttendance',
  default: undefined,
});

export const useAnalyticsMeetingRepAttendance = (
  options: MeetingRepAttendanceOptions,
): ListMeetingRepAttendanceResponse => {
  const opensearchClient =
    useAnalyticsOpensearch<MeetingRepAttendanceDataObject>('attendance').client;

  const [meetingRepAttendance, setMeetingRepAttendance] = useRecoilState(
    analyticsMeetingRepAttendanceState({
      currentPage: options.currentPage,
      pageSize: options.pageSize,
      tags: options.tags,
      timeRange: options.timeRange,
      sort: options.sort,
    }),
  );

  if (meetingRepAttendance === undefined) {
    throw getMeetingRepAttendance(opensearchClient, {
      currentPage: options.currentPage,
      pageSize: options.pageSize,
      tags: options.tags,
      timeRange: options.timeRange,
      sort: options.sort,
    })
      .then(setMeetingRepAttendance)
      .catch(setMeetingRepAttendance);
  }

  if (meetingRepAttendance instanceof Error) {
    throw meetingRepAttendance;
  }

  return meetingRepAttendance;
};
