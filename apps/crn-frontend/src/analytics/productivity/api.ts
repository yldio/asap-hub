import {
  AlgoliaClient,
  AnalyticsPerformanceOptions,
  AnalyticsSearchOptions,
  AnalyticsSearchOptionsWithFiltering,
  getMetric,
  getPerformanceForMetric,
  TEAM_PRODUCTIVITY,
  TEAM_PRODUCTIVITY_PERFORMANCE,
  USER_PRODUCTIVITY,
  USER_PRODUCTIVITY_PERFORMANCE,
} from '@asap-hub/algolia';
import {
  ListTeamProductivityAlgoliaResponse,
  TeamProductivityPerformance,
  SortTeamProductivity,
  SortUserProductivity,
  UserProductivityPerformance,
  DocumentCategoryOption,
  OutputTypeOption,
  TimeRangeOption,
  UserProductivityResponse,
} from '@asap-hub/model';
import {
  OpensearchClient,
  OpensearchSort,
  SearchResult,
} from '../utils/opensearch';

type OpensearchSortMap<T extends `${string}_asc` | `${string}_desc`> = Record<
  T,
  OpensearchSort[]
>;

const userProductivyOpensearchSort: OpensearchSortMap<SortUserProductivity> = {
  user_asc: [
    {
      'name.keyword': {
        order: 'asc',
      },
    },
  ],
  user_desc: [
    {
      'name.keyword': {
        order: 'desc',
      },
    },
  ],
  team_asc: [
    {
      'teams.team.keyword': {
        nested: { path: 'teams' },
        order: 'asc',
      },
    },
    {
      'name.keyword': {
        order: 'asc',
      },
    },
  ],
  team_desc: [
    {
      'teams.team.keyword': {
        nested: { path: 'teams' },
        order: 'desc',
      },
    },
    {
      'name.keyword': {
        order: 'asc',
      },
    },
  ],
  asap_output_asc: [
    {
      asapOutput: {
        order: 'asc',
      },
    },
    {
      'name.keyword': {
        order: 'asc',
      },
    },
  ],
  asap_output_desc: [
    {
      asapOutput: {
        order: 'desc',
      },
    },
    {
      'name.keyword': {
        order: 'asc',
      },
    },
  ],
  asap_public_output_asc: [
    {
      asapPublicOutput: {
        order: 'asc',
      },
    },
    {
      'name.keyword': {
        order: 'asc',
      },
    },
  ],
  asap_public_output_desc: [
    {
      asapPublicOutput: {
        order: 'desc',
      },
    },
    {
      'name.keyword': {
        order: 'asc',
      },
    },
  ],
  ratio_asc: [
    {
      ratio: { order: 'asc' },
    },
    {
      'name.keyword': {
        order: 'asc',
      },
    },
  ],
  ratio_desc: [
    {
      ratio: { order: 'desc' },
    },
    {
      'name.keyword': {
        order: 'asc',
      },
    },
  ],
  role_asc: [
    {
      'teams.role': {
        nested: { path: 'teams' },
        order: 'asc',
      },
    },
    {
      'teams.team.keyword': {
        nested: { path: 'teams' },
        order: 'asc',
      },
    },
    {
      'name.keyword': {
        order: 'asc',
      },
    },
  ],
  role_desc: [
    {
      'teams.role': {
        nested: { path: 'teams' },
        order: 'desc',
      },
    },
    {
      'teams.team.keyword': {
        nested: { path: 'teams' },
        order: 'asc',
      },
    },
    {
      'name.keyword': {
        order: 'asc',
      },
    },
  ],
};

export const getUserProductivity = (
  client:
    | AlgoliaClient<'analytics'>
    | OpensearchClient<UserProductivityResponse>,
  options: AnalyticsSearchOptionsWithFiltering<SortUserProductivity>,
) => {
  if (client instanceof OpensearchClient) {
    const { tags, currentPage, pageSize, timeRange, documentCategory, sort } =
      options;
    return client.search(
      tags,
      currentPage,
      pageSize,
      timeRange,
      'teams',
      documentCategory,
      userProductivyOpensearchSort[sort],
    );
  } else {
    return getMetric<
      SearchResult<UserProductivityResponse>,
      SortUserProductivity
    >(USER_PRODUCTIVITY)(client, options);
  }
};

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

export const getUserProductivityPerformance = async (
  client:
    | AlgoliaClient<'analytics'>
    | OpensearchClient<UserProductivityPerformance>,
  options: AnalyticsPerformanceOptions,
) => {
  if (client instanceof OpensearchClient) {
    const results = await client.search(
      [],
      null,
      null,
      options.timeRange,
      'teams',
      options.documentCategory,
      [],
    );
    return results.items[0] as UserProductivityPerformance | undefined;
  } else {
    return getPerformanceForMetric<UserProductivityPerformance>(
      USER_PRODUCTIVITY_PERFORMANCE,
    )(client, options);
  }
};

export const getTeamProductivityPerformance =
  getPerformanceForMetric<TeamProductivityPerformance>(
    TEAM_PRODUCTIVITY_PERFORMANCE,
  );
