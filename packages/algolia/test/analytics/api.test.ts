import {
  createAlgoliaResponse,
  performanceByDocumentType,
  teamProductivityResponse,
} from '@asap-hub/fixtures';
import {
  ListTeamProductivityAlgoliaResponse,
  SortTeamProductivity,
  TeamProductivityPerformance,
} from '@asap-hub/model';
import { beforeEach } from 'node:test';
import {
  AlgoliaSearchClient,
  ClientSearchResponse,
  getPerformanceForMetric,
  TEAM_PRODUCTIVITY_PERFORMANCE,
  TEAM_PRODUCTIVITY,
} from '../..';
import { getMetricWithRange } from '../../src';

type Search = () => Promise<
  ClientSearchResponse<
    'analytics',
    typeof TEAM_PRODUCTIVITY | typeof TEAM_PRODUCTIVITY_PERFORMANCE
  >
>;

const search: jest.MockedFunction<Search> = jest.fn();

const algoliaSearchClient = {
  search,
  _index: '',
  _reverseEventsIndex: '',
} as unknown as AlgoliaSearchClient<'analytics'>;

describe('getPerformanceForMetric ', () => {
  beforeEach(() => {
    search.mockReset();
  });

  it('creates a performance metric api function', async () => {
    const get = getPerformanceForMetric<TeamProductivityPerformance>(
      TEAM_PRODUCTIVITY_PERFORMANCE,
    );
    search.mockResolvedValue(
      createAlgoliaResponse<'analytics', 'team-productivity-performance'>([
        {
          ...performanceByDocumentType,
          objectID: '12',
          __meta: { type: 'team-productivity-performance', range: '30d' },
        },
      ]),
    );
    await get(algoliaSearchClient);
    expect(search).toHaveBeenCalledWith(['team-productivity-performance'], '', {
      filters: '__meta.range:"30d"',
    });
  });
});

describe('getMetricWithRange', () => {
  beforeEach(() => {
    search.mockReset();
  });

  it('creates a metric api function', async () => {
    const get = getMetricWithRange<
      ListTeamProductivityAlgoliaResponse,
      SortTeamProductivity
    >(TEAM_PRODUCTIVITY);
    search.mockResolvedValue(
      createAlgoliaResponse<'analytics', 'team-productivity'>([
        {
          ...teamProductivityResponse,
          __meta: { type: 'team-productivity', range: '30d' },
        },
      ]),
    );
    await get(
      { ...algoliaSearchClient, _index: '' },
      {
        pageSize: null,
        currentPage: null,
        timeRange: '30d',
        sort: 'team_asc',
        tags: [],
      },
    );
    expect(search).toHaveBeenCalledWith(['team-productivity'], '', {
      filters: '__meta.range:"30d"',
      hitsPerPage: undefined,
      page: undefined,
      tagFilters: [[]],
    });
  });
});
