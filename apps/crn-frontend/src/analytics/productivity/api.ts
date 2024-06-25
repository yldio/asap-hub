import { getMetricWithRange, getPerformanceForMetric } from '@asap-hub/algolia';
import {
  ListTeamProductivityAlgoliaResponse,
  ListUserProductivityAlgoliaResponse,
  TeamProductivityPerformance,
  SortTeamProductivity,
  SortUserProductivity,
  UserProductivityPerformance,
} from '@asap-hub/model';

export const getUserProductivity = getMetricWithRange<
  ListUserProductivityAlgoliaResponse,
  SortUserProductivity
>('user-productivity');

export const getTeamProductivity = getMetricWithRange<
  ListTeamProductivityAlgoliaResponse,
  SortTeamProductivity
>('team-productivity');

export const getUserProductivityPerformance =
  getPerformanceForMetric<UserProductivityPerformance>(
    'user-productivity-performance',
  );
export const getTeamProductivityPerformance =
  getPerformanceForMetric<TeamProductivityPerformance>(
    'team-productivity-performance',
  );
