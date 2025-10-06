import { AnalyticsSearchOptionsWithFiltering } from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  EngagementAlgoliaResponse,
  EngagementPerformance,
  ListEngagementAlgoliaResponse,
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

import { useAnalyticsAlgolia } from '../../hooks/algolia';
import { useAnalyticsOpensearch } from '../../hooks';
import {
  getAlgoliaIndexName,
  makePerformanceHook,
  makePerformanceState,
} from '../utils/state';
import {
  getEngagement,
  getEngagementPerformance,
  getMeetingRepAttendance,
  MeetingRepAttendanceOptions,
} from './api';

const analyticsEngagementIndexState = atomFamily<
  { ids: ReadonlyArray<string>; total: number } | Error | undefined,
  Pick<GetListOptions, 'currentPage' | 'pageSize'>
>({
  key: 'analyticsEngagementIndex',
  default: undefined,
});

export const analyticsEngagementListState = atomFamily<
  EngagementAlgoliaResponse | undefined,
  string
>({
  key: 'analyticsEngagementList',
  default: undefined,
});

export const analyticsEngagementState = selectorFamily<
  ListEngagementAlgoliaResponse | Error | undefined,
  Pick<GetListOptions, 'currentPage' | 'pageSize'>
>({
  key: 'engagement',
  get:
    (options) =>
    ({ get }) => {
      const index = get(analyticsEngagementIndexState(options));
      if (index === undefined || index instanceof Error) return index;
      const teams: EngagementAlgoliaResponse[] = [];
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
          set(analyticsEngagementListState(engagement.objectID), engagement),
        );
        set(analyticsEngagementIndexState(options), {
          total: newEngagement.total,
          ids: newEngagement.items.map((engagement) => engagement.objectID),
        });
      }
    },
});

export const useAnalyticsEngagement = (
  options: AnalyticsSearchOptionsWithFiltering<SortEngagement>,
) => {
  const indexName = getAlgoliaIndexName(options.sort, 'engagement');

  const algoliaClient = useAnalyticsAlgolia(indexName);
  const [engagement, setEngagement] = useRecoilState(
    analyticsEngagementState(options),
  );

  if (engagement === undefined) {
    throw getEngagement(algoliaClient.client, options)
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
  makePerformanceHook<EngagementPerformance>(
    engagementPerformanceState,
    getEngagementPerformance,
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
