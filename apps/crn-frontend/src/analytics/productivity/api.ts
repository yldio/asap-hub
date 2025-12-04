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
  TeamProductivityPerformance,
  SortTeamProductivity,
  SortUserProductivity,
  UserProductivityPerformance,
  DocumentCategoryOption,
  OutputTypeOption,
  TimeRangeOption,
  UserProductivityResponse,
  TeamProductivityResponse,
} from '@asap-hub/model';
import {
  buildNormalizedStringSort,
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
  asap_output_asc: [
    {
      asapOutput: {
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
  ],
  asap_public_output_asc: [
    {
      asapPublicOutput: {
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
  ],
  ratio_asc: [
    {
      ratio: { order: 'asc' },
    },
  ],
  ratio_desc: [
    {
      ratio: { order: 'desc' },
    },
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
};

const teamProductivityOpensearchSort: OpensearchSortMap<SortTeamProductivity> =
  {
    team_asc: [{ 'name.keyword': { order: 'asc' } }],
    team_desc: [{ 'name.keyword': { order: 'desc' } }],
    article_asc: [{ Article: { order: 'asc' } }],
    article_desc: [{ Article: { order: 'desc' } }],
    bioinformatics_asc: [{ Bioinformatics: { order: 'asc' } }],
    bioinformatics_desc: [{ Bioinformatics: { order: 'desc' } }],
    dataset_asc: [{ Dataset: { order: 'asc' } }],
    dataset_desc: [{ Dataset: { order: 'desc' } }],
    lab_material_asc: [{ 'Lab Material': { order: 'asc' } }],
    lab_material_desc: [{ 'Lab Material': { order: 'desc' } }],
    protocol_asc: [{ Protocol: { order: 'asc' } }],
    protocol_desc: [{ Protocol: { order: 'desc' } }],
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
    return client.search({
      searchTags: tags,
      currentPage: currentPage ?? undefined,
      pageSize: pageSize ?? undefined,
      timeRange,
      searchScope: 'extended',
      documentCategory,
      sort: userProductivyOpensearchSort[sort],
    });
  }
  return getMetric<
    SearchResult<UserProductivityResponse>,
    SortUserProductivity
  >(USER_PRODUCTIVITY)(client, options);
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

export const getTeamProductivity = (
  client:
    | AlgoliaClient<'analytics'>
    | OpensearchClient<TeamProductivityResponse>,
  options: AnalyticsSearchOptionsWithFiltering<SortTeamProductivity>,
) => {
  if (client instanceof OpensearchClient) {
    const { tags, currentPage, pageSize, timeRange, outputType, sort } =
      options;
    return client.search({
      searchTags: tags,
      currentPage: currentPage ?? undefined,
      pageSize: pageSize ?? undefined,
      timeRange,
      searchScope: 'flat',
      sort: teamProductivityOpensearchSort[sort],
      outputType,
    });
  }
  return getMetric<
    SearchResult<TeamProductivityResponse>,
    SortTeamProductivity
  >(TEAM_PRODUCTIVITY)(client, options);
};

export const getUserProductivityPerformance = async (
  client:
    | AlgoliaClient<'analytics'>
    | OpensearchClient<UserProductivityPerformance>,
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
    return results.items[0] as UserProductivityPerformance | undefined;
  }
  return getPerformanceForMetric<UserProductivityPerformance>(
    USER_PRODUCTIVITY_PERFORMANCE,
  )(client, options);
};

export const getTeamProductivityPerformance = async (
  client:
    | AlgoliaClient<'analytics'>
    | OpensearchClient<TeamProductivityPerformance>,
  options: AnalyticsPerformanceOptions,
) => {
  if (client instanceof OpensearchClient) {
    const results = await client.search({
      searchTags: [],
      timeRange: options.timeRange,
      searchScope: 'flat',
      sort: [],
      outputType: options.outputType,
    });
    return results.items[0] as TeamProductivityPerformance | undefined;
  }
  return getPerformanceForMetric<TeamProductivityPerformance>(
    TEAM_PRODUCTIVITY_PERFORMANCE,
  )(client, options);
};
