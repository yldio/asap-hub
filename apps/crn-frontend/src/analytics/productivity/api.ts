import { getMetricWithRange, getPerformanceForMetric } from '@asap-hub/algolia';
import {
  ListTeamProductivityAlgoliaResponse,
  ListUserProductivityAlgoliaResponse,
  TeamProductivityPerformance,
  SortTeamProductivity,
  SortUserProductivity,
  TimeRangeOption,
  UserProductivityPerformance,
} from '@asap-hub/model';
import { AnalyticsSearchOptions } from '../leadership/api';

export type ProductivityListOptions = Pick<
  AnalyticsSearchOptions,
  'currentPage' | 'pageSize' | 'tags'
> & {
  timeRange: TimeRangeOption;
  sort: SortUserProductivity | SortTeamProductivity;
};

export const getUserProductivity =
  getMetricWithRange<ListUserProductivityAlgoliaResponse>('user-productivity');
export const getTeamProductivity =
  getMetricWithRange<ListTeamProductivityAlgoliaResponse>('team-productivity');

export const getUserProductivityPerformance =
  getPerformanceForMetric<UserProductivityPerformance>(
    'user-productivity-performance',
  );
export const getTeamProductivityPerformance =
  getPerformanceForMetric<TeamProductivityPerformance>(
    'team-productivity-performance',
  );
