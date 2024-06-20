import { getMetricWithRange, getPerformanceForMetric } from '@asap-hub/algolia';
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
  getMetricWithRange<ListUserCollaborationAlgoliaResponse>(
    'user-collaboration',
  );

export const getTeamCollaboration =
  getMetricWithRange<ListTeamCollaborationAlgoliaResponse>(
    'team-collaboration',
  );

export const getTeamCollaborationPerformance =
  getPerformanceForMetric<TeamCollaborationPerformance>(
    'team-collaboration-performance',
  );
