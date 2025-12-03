import {
  getPerformanceForMetric,
  getMetric,
  TEAM_COLLABORATION_PERFORMANCE,
  USER_COLLABORATION,
  TEAM_COLLABORATION,
  USER_COLLABORATION_PERFORMANCE,
} from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  ListTeamCollaborationAlgoliaResponse,
  ListUserCollaborationAlgoliaResponse,
  TeamCollaborationPerformance,
  UserCollaborationPerformance,
  TimeRangeOption,
  DocumentCategoryOption,
  OutputTypeOption,
  SortUserCollaboration,
  SortTeamCollaboration,
  ListPreliminaryDataSharingResponse,
  PreliminaryDataSharingDataObject,
  LimitedTimeRangeOption,
} from '@asap-hub/model';
import { OpensearchClient } from '../utils/opensearch';

export type CollaborationListOptions = Pick<
  GetListOptions,
  'currentPage' | 'pageSize'
> & {
  timeRange: TimeRangeOption;
  documentCategory?: DocumentCategoryOption;
  outputType?: OutputTypeOption;
};

export const getUserCollaboration = getMetric<
  ListUserCollaborationAlgoliaResponse,
  SortUserCollaboration
>(USER_COLLABORATION);

export const getTeamCollaboration = getMetric<
  ListTeamCollaborationAlgoliaResponse,
  SortTeamCollaboration
>(TEAM_COLLABORATION);

export const getTeamCollaborationPerformance =
  getPerformanceForMetric<TeamCollaborationPerformance>(
    TEAM_COLLABORATION_PERFORMANCE,
  );

export const getUserCollaborationPerformance =
  getPerformanceForMetric<UserCollaborationPerformance>(
    USER_COLLABORATION_PERFORMANCE,
  );

export type PreliminaryDataSharingSearchOptions = {
  currentPage: number | null;
  pageSize: number | null;
  tags: string[];
  timeRange: LimitedTimeRangeOption;
};

export const getPreliminaryDataSharing = async (
  opensearchClient: OpensearchClient<PreliminaryDataSharingDataObject>,
  {
    tags,
    currentPage,
    pageSize,
    timeRange,
  }: PreliminaryDataSharingSearchOptions,
): Promise<ListPreliminaryDataSharingResponse | undefined> => {
  const response = await opensearchClient.search({
    searchTags: tags,
    currentPage: currentPage ?? undefined,
    pageSize: pageSize ?? undefined,
    timeRange,
    searchScope: 'teams',
  });

  return {
    items: response.items || [],
    total: response.total || 0,
  };
};
