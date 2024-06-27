import {
  getPerformanceForMetric,
  getMetric,
  TEAM_COLLABORATION_PERFORMANCE,
  USER_COLLABORATION,
  TEAM_COLLABORATION,
} from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  ListTeamCollaborationAlgoliaResponse,
  ListUserCollaborationAlgoliaResponse,
  TeamCollaborationPerformance,
  TimeRangeOption,
} from '@asap-hub/model';

export type CollaborationListOptions = Pick<
  GetListOptions,
  'currentPage' | 'pageSize'
> & {
  timeRange: TimeRangeOption;
};

export const getUserCollaboration =
  getMetric<ListUserCollaborationAlgoliaResponse>(USER_COLLABORATION);

export const getTeamCollaboration =
  getMetric<ListTeamCollaborationAlgoliaResponse>(TEAM_COLLABORATION);

export const getTeamCollaborationPerformance =
  getPerformanceForMetric<TeamCollaborationPerformance>(
    TEAM_COLLABORATION_PERFORMANCE,
  );
