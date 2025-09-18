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
} from '@asap-hub/model';
import { OpensearchClient, OpensearchHitsResponse } from '../utils/opensearch';

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
  timeRange: TimeRangeOption;
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
  const query = {
    query: {
      bool: {
        must: [
          {
            match: {
              timeRange,
            },
          },
          ...(tags && tags.length > 0
            ? [
                {
                  bool: {
                    should: tags.map((tag) => ({
                      term: {
                        'teamName.keyword': tag,
                      },
                    })),
                    minimum_should_match: 1,
                  },
                },
              ]
            : []),
        ],
      },
    },
    from: (currentPage || 0) * (pageSize || 10),
    size: pageSize || 10,
    sort: [
      {
        'teamName.keyword': {
          order: 'asc',
        },
      },
    ],
  };

  const response =
    await opensearchClient.request<
      OpensearchHitsResponse<PreliminaryDataSharingDataObject>
    >(query);

  return {
    // eslint-disable-next-line no-underscore-dangle
    items: response.hits?.hits?.map((hit) => hit._source) || [],
    total: response.hits?.total?.value || 0,
  };
};
