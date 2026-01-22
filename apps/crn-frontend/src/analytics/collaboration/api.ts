import {
  AlgoliaClient,
  AnalyticsPerformanceOptions,
  AnalyticsSearchOptionsWithFiltering,
  getMetric,
  getPerformanceForMetric,
  TEAM_COLLABORATION,
  TEAM_COLLABORATION_PERFORMANCE,
  USER_COLLABORATION,
  USER_COLLABORATION_PERFORMANCE,
} from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  DocumentCategoryOption,
  LimitedTimeRangeOption,
  ListPreliminaryDataSharingResponse,
  ListTeamCollaborationResponse,
  OutputTypeOption,
  PreliminaryDataSharingDataObject,
  SortTeamCollaboration,
  SortUserCollaboration,
  TeamCollaborationPerformance,
  TimeRangeOption,
  UserCollaborationPerformance,
  UserCollaborationResponse,
} from '@asap-hub/model';
import {
  buildNormalizedStringSort,
  OpensearchClient,
  OpensearchSort,
  SearchResult,
} from '../utils/opensearch';

export type CollaborationListOptions = Pick<
  GetListOptions,
  'currentPage' | 'pageSize'
> & {
  timeRange: TimeRangeOption;
  documentCategory?: DocumentCategoryOption;
  outputType?: OutputTypeOption;
};

type OpensearchSortMap<T extends `${string}_asc` | `${string}_desc` | string> =
  Record<T, OpensearchSort[]>;

const userCollaborationOpensearchSort: OpensearchSortMap<SortUserCollaboration> =
  {
    user_asc: [
      buildNormalizedStringSort({
        keyword: 'name.keyword',
        order: 'asc',
      }),
    ],
    user_desc: [
      buildNormalizedStringSort({
        keyword: 'name.keyword',
        order: 'desc',
      }),
    ],
    team_asc: [
      buildNormalizedStringSort({
        keyword: 'teams.team.keyword',
        order: 'asc',
        nested: { path: 'teams' },
      }),
    ],
    team_desc: [
      buildNormalizedStringSort({
        keyword: 'teams.team.keyword',
        order: 'desc',
        nested: { path: 'teams' },
      }),
    ],
    role_asc: [
      {
        'teams.role': {
          nested: { path: 'teams' },
          order: 'asc',
          missing: '_last',
        },
      },
    ],
    role_desc: [
      {
        'teams.role': {
          nested: { path: 'teams' },
          order: 'desc',
          missing: '_last',
        },
      },
    ],
    outputs_coauthored_within_asc: [
      {
        totalUniqueOutputsCoAuthoredWithinTeam: {
          order: 'asc',
        },
      },
    ],
    outputs_coauthored_within_desc: [
      {
        totalUniqueOutputsCoAuthoredWithinTeam: {
          order: 'desc',
        },
      },
    ],
    outputs_coauthored_across_asc: [
      {
        totalUniqueOutputsCoAuthoredAcrossTeams: {
          order: 'asc',
        },
      },
    ],
    outputs_coauthored_across_desc: [
      {
        totalUniqueOutputsCoAuthoredAcrossTeams: {
          order: 'desc',
        },
      },
    ],
  };

const teamCollborationOpensearchSort: OpensearchSortMap<SortTeamCollaboration> =
  {
    team_asc: [
      buildNormalizedStringSort({
        keyword: 'name.keyword',
        order: 'asc',
      }),
    ],
    team_desc: [
      buildNormalizedStringSort({
        keyword: 'name.keyword',
        order: 'desc',
      }),
    ],
    article_asc: [
      {
        'articles.title': {
          order: 'asc',
        },
      },
    ],
    article_desc: [
      {
        'articles.title': {
          order: 'desc',
        },
      },
    ],
    bioinformatics_asc: [
      {
        bioinformatics: {
          order: 'asc',
        },
      },
    ],
    bioinformatics_desc: [
      {
        bioinformatics: {
          order: 'desc',
        },
      },
    ],
    dataset_asc: [
      {
        datasets: {
          order: 'asc',
        },
      },
    ],
    dataset_desc: [
      {
        datasets: {
          order: 'desc',
        },
      },
    ],
    lab_material_asc: [
      {
        'lab_material.title': {
          order: 'asc',
        },
      },
    ],
    lab_material_desc: [
      {
        'lab_material.title': {
          order: 'desc',
        },
      },
    ],
    protocol_asc: [
      {
        protocols: {
          order: 'asc',
        },
      },
    ],
    protocol_desc: [
      {
        protocols: {
          order: 'desc',
        },
      },
    ],
  };

export const getUserCollaboration = (
  client:
    | AlgoliaClient<'analytics'>
    | OpensearchClient<UserCollaborationResponse>,
  options: AnalyticsSearchOptionsWithFiltering<SortUserCollaboration>,
) => {
  if (client instanceof OpensearchClient) {
    const { tags, currentPage, pageSize, timeRange, documentCategory, sort } =
      options;
    return client.search({
      searchTags: tags,
      currentPage: currentPage ?? undefined,
      pageSize: pageSize ?? undefined,
      timeRange,
      searchScope: 'extended',
      documentCategory,
      sort: userCollaborationOpensearchSort[sort],
    });
  }
  return getMetric<
    SearchResult<UserCollaborationResponse>,
    SortUserCollaboration
  >(USER_COLLABORATION)(client, options);
};

export const getTeamCollaboration = (
  client:
    | AlgoliaClient<'analytics'>
    | OpensearchClient<ListTeamCollaborationResponse>,
  options: AnalyticsSearchOptionsWithFiltering<SortTeamCollaboration>,
) => {
  if (client instanceof OpensearchClient) {
    const { tags, currentPage, pageSize, timeRange, documentCategory, sort } =
      options;
    return client.search({
      searchTags: tags,
      currentPage: currentPage ?? undefined,
      pageSize: pageSize ?? undefined,
      timeRange,
      searchScope: 'flat',
      documentCategory,
      sort: teamCollborationOpensearchSort[sort],
    });
  }
  return getMetric<
    SearchResult<ListTeamCollaborationResponse>,
    SortTeamCollaboration
  >(TEAM_COLLABORATION)(client, options);
};

export const getTeamCollaborationPerformance = async (
  client:
    | AlgoliaClient<'analytics'>
    | OpensearchClient<TeamCollaborationPerformance>,
  options: AnalyticsPerformanceOptions,
) => {
  if (client instanceof OpensearchClient) {
    const results = await client.search({
      searchTags: [],
      timeRange: options.timeRange,
      searchScope: 'flat',
      sort: [],
      documentCategory: options.documentCategory,
    });
    return results.items[0] as TeamCollaborationPerformance | undefined;
  }
  return getPerformanceForMetric<TeamCollaborationPerformance>(
    TEAM_COLLABORATION_PERFORMANCE,
  )(client, options);
};

export const getUserCollaborationPerformance = async (
  client:
    | AlgoliaClient<'analytics'>
    | OpensearchClient<UserCollaborationPerformance>,
  options: AnalyticsPerformanceOptions,
) => {
  if (client instanceof OpensearchClient) {
    const results = await client.search({
      searchTags: [],
      timeRange: options.timeRange,
      searchScope: 'flat',
      sort: [],
      documentCategory: options.documentCategory,
    });
    return results.items[0] as UserCollaborationPerformance | undefined;
  }
  return getPerformanceForMetric<UserCollaborationPerformance>(
    USER_COLLABORATION_PERFORMANCE,
  )(client, options);
};

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
    searchScope: 'flat',
  });

  return {
    items: response.items || [],
    total: response.total || 0,
  };
};
