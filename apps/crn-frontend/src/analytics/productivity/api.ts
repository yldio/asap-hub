import {
  getMetricWithRange,
  getPerformanceForMetric,
  TEAM_PRODUCTIVITY,
  TEAM_PRODUCTIVITY_PERFORMANCE,
  USER_PRODUCTIVITY,
  USER_PRODUCTIVITY_PERFORMANCE,
} from '@asap-hub/algolia';
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
>(USER_PRODUCTIVITY);

export const getTeamProductivity = getMetricWithRange<
  ListTeamProductivityAlgoliaResponse,
  SortTeamProductivity
>(TEAM_PRODUCTIVITY);

export const getUserProductivityPerformance =
  getPerformanceForMetric<UserProductivityPerformance>(
    USER_PRODUCTIVITY_PERFORMANCE,
  );
export const getTeamProductivityPerformance =
  getPerformanceForMetric<TeamProductivityPerformance>(
    TEAM_PRODUCTIVITY_PERFORMANCE,
  );
