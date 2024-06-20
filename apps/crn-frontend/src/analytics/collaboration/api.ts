import { getMetricWithRange, getPerformanceForMetric } from '@asap-hub/algolia';
import {
  ListTeamCollaborationAlgoliaResponse,
  ListUserCollaborationAlgoliaResponse,
  TeamCollaborationPerformance,
} from '@asap-hub/model';

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
