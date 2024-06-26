import {
  performanceByDocumentType,
  teamProductivityResponse,
} from '@asap-hub/fixtures';
import {
  ListTeamProductivityAlgoliaResponse,
  SortTeamProductivity,
  TeamProductivityPerformance,
} from '@asap-hub/model';
import {
  AlgoliaSearchClient,
  ClientSearchResponse,
  getPerformanceForMetric,
  TEAM_PRODUCTIVITY_PERFORMANCE,
  TEAM_PRODUCTIVITY,
  createAlgoliaResponse,
  getMetricWithRange,
} from '../../src';

type Search = () => Promise<
  ClientSearchResponse<
    'analytics',
    typeof TEAM_PRODUCTIVITY | typeof TEAM_PRODUCTIVITY_PERFORMANCE
  >
>;
describe('getPerformanceForMetric', () => {
  const search: jest.MockedFunction<Search> = jest.fn();

  const algoliaSearchClient = {
    search,
  } as unknown as AlgoliaSearchClient<'analytics'>;

  beforeEach(() => {
    search.mockReset();
    search.mockResolvedValueOnce(
      createAlgoliaResponse<'analytics', 'team-productivity-performance'>([
        {
          ...performanceByDocumentType,
          objectID: '12',
          __meta: { type: 'team-productivity-performance', range: '30d' },
        },
      ]),
    );
  });

  it('a creates a performance metric api function', async () => {
    const get = getPerformanceForMetric<TeamProductivityPerformance>(
      TEAM_PRODUCTIVITY_PERFORMANCE,
    );
    await get(algoliaSearchClient, { timeRange: '30d' });
    expect(search).toHaveBeenCalledWith(
      ['team-productivity-performance'],
      '',
      expect.objectContaining({
        filters: '(__meta.range:"30d")',
      }),
    );
  });

  it('handles documentCategory', async () => {
    const get = getPerformanceForMetric<TeamProductivityPerformance>(
      TEAM_PRODUCTIVITY_PERFORMANCE,
    );

    await get(algoliaSearchClient, {
      timeRange: '30d',
      documentCategory: 'all',
    });
    expect(search).toHaveBeenCalledWith(
      ['team-productivity-performance'],
      '',
      expect.objectContaining({
        filters: '(__meta.range:"30d") AND (__meta.documentCategory:"all")',
      }),
    );
  });
});

describe('getMetricWithRange', () => {
  const search: jest.MockedFunction<Search> = jest.fn();

  const algoliaSearchClient = {
    search,
  } as unknown as AlgoliaSearchClient<'analytics'>;

  beforeEach(() => {
    search.mockReset();
    search.mockResolvedValue(
      createAlgoliaResponse<'analytics', 'team-productivity'>([
        {
          ...teamProductivityResponse,
          __meta: { type: 'team-productivity', range: '30d' },
        },
      ]),
    );
  });
  it('creates a metric api function', async () => {
    const get = getMetricWithRange<
      ListTeamProductivityAlgoliaResponse,
      SortTeamProductivity
    >(TEAM_PRODUCTIVITY);

    await get(algoliaSearchClient, {
      pageSize: null,
      currentPage: null,
      timeRange: '30d',
      sort: 'team_asc',
      tags: [],
    });
    expect(search).toHaveBeenCalledWith(['team-productivity'], '', {
      filters: '(__meta.range:"30d")',
      hitsPerPage: undefined,
      page: undefined,
      tagFilters: [[]],
    });
  });

  it('handles documentCategory', async () => {
    const get = getMetricWithRange<
      ListTeamProductivityAlgoliaResponse,
      SortTeamProductivity
    >(TEAM_PRODUCTIVITY);

    await get(algoliaSearchClient, {
      pageSize: null,
      currentPage: null,
      documentCategory: 'all',
      timeRange: '30d',
      sort: 'team_asc',
      tags: [],
    });
    expect(search).toHaveBeenCalledWith(['team-productivity'], '', {
      filters: '(__meta.range:"30d") AND (__meta.documentCategory:"all")',
      hitsPerPage: undefined,
      page: undefined,
      tagFilters: [[]],
    });
  });
});
