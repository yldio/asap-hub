import {
  getMetric,
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
  DocumentCategoryOption,
  OutputTypeOption,
} from '@asap-hub/model';

export const getUserProductivity = getMetric<
  ListUserProductivityAlgoliaResponse,
  SortUserProductivity
>(USER_PRODUCTIVITY);

export type ProductivityListOptions = Pick<
  AnalyticsSearchOptions,
  'currentPage' | 'pageSize' | 'tags'
> & {
  timeRange: TimeRangeOption;
  documentCategory?: DocumentCategoryOption;
  outputType?: OutputTypeOption;
  sort: SortUserProductivity | SortTeamProductivity;
};

export const getTeamProductivity = getMetric<
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
