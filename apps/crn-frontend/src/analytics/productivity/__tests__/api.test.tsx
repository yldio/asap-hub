import {
  createAlgoliaResponse,
  AlgoliaSearchClient,
  AnalyticsSearchOptionsWithFiltering,
  ClientSearchResponse,
} from '@asap-hub/algolia';
import {
  performanceByDocumentType,
  teamProductivityResponse,
  userProductivityPerformance,
  userProductivityResponse,
  teamProductivityPerformance,
} from '@asap-hub/fixtures';
import {
  SortTeamProductivity,
  SortUserProductivity,
  TimeRangeOption,
} from '@asap-hub/model';
import nock from 'nock';

import {
  getTeamProductivity,
  getTeamProductivityPerformance,
  getUserProductivity,
  getUserProductivityPerformance,
} from '../api';

jest.mock('../../../config');

afterEach(() => {
  nock.cleanAll();
});

type Search = () => Promise<
  ClientSearchResponse<
    'analytics',
    | 'team-productivity'
    | 'team-productivity-performance'
    | 'user-productivity'
    | 'user-productivity-performance'
  >
>;

const search: jest.MockedFunction<Search> = jest.fn();

const algoliaSearchClient = {
  search,
} as unknown as AlgoliaSearchClient<'analytics'>;

const defaultUserOptions: AnalyticsSearchOptionsWithFiltering<SortUserProductivity> =
  {
    pageSize: null,
    currentPage: null,
    timeRange: '30d',
    documentCategory: 'all',
    sort: 'user_asc',
    tags: [],
  };

const defaultTeamOptions: AnalyticsSearchOptionsWithFiltering<SortTeamProductivity> =
  {
    pageSize: null,
    currentPage: null,
    timeRange: '30d',
    outputType: 'all',
    sort: 'team_asc',
    tags: [],
  };

describe('getUserProductivity', () => {
  beforeEach(() => {
    search.mockReset();

    search.mockResolvedValue(
      createAlgoliaResponse<'analytics', 'user-productivity'>([
        {
          ...userProductivityResponse,
          objectID: `${userProductivityResponse.id}-user-productivity-30d`,
          __meta: { type: 'user-productivity', range: '30d' },
        },
      ]),
    );
  });
  it('returns successfully fetched user productivity', async () => {
    const userProductivity = await getUserProductivity(
      algoliaSearchClient,
      defaultUserOptions,
    );
    expect(userProductivity).toEqual(
      expect.objectContaining({
        items: [
          {
            ...userProductivityResponse,
            __meta: { type: 'user-productivity', range: '30d' },
          },
        ],
        total: 1,
      }),
    );
  });

  it.each`
    range                        | timeRange
    ${'Last 30 days'}            | ${'30d'}
    ${'Last 90 days'}            | ${'90d'}
    ${'This year (Jan-Today)'}   | ${'current-year'}
    ${'Last 12 months'}          | ${'last-year'}
    ${'Since Hub Launch (2020)'} | ${'all'}
  `('returns user productivity for $range', async ({ timeRange }) => {
    await getUserProductivity(algoliaSearchClient, {
      ...defaultUserOptions,
      timeRange,
    });

    expect(search).toHaveBeenCalledWith(
      ['user-productivity'],
      '',
      expect.objectContaining({
        filters: `(__meta.range:"${timeRange}") AND (__meta.documentCategory:"all")`,
      }),
    );
  });

  it('should pass the search query to Algolia', async () => {
    await getUserProductivity(algoliaSearchClient, {
      ...defaultUserOptions,
      tags: ['Alessi'],
    });
    expect(search).toHaveBeenCalledWith(
      ['user-productivity'],
      '',
      expect.objectContaining({
        tagFilters: [['Alessi']],
      }),
    );
  });
});

describe('getTeamProductivity', () => {
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

  it('returns successfully fetched team productivity', async () => {
    const teamProductivity = await getTeamProductivity(algoliaSearchClient, {
      ...defaultTeamOptions,
      sort: 'team_asc',
    });
    expect(teamProductivity).toEqual(
      expect.objectContaining({
        items: [
          {
            ...teamProductivityResponse,
            __meta: { type: 'team-productivity', range: '30d' },
          },
        ],
        total: 1,
      }),
    );
  });

  it.each`
    range                        | timeRange
    ${'Last 30 days'}            | ${'30d'}
    ${'Last 90 days'}            | ${'90d'}
    ${'This year (Jan-Today)'}   | ${'current-year'}
    ${'Last 12 months'}          | ${'last-year'}
    ${'Since Hub Launch (2020)'} | ${'all'}
  `('returns team productivity for $range', async ({ timeRange }) => {
    await getTeamProductivity(algoliaSearchClient, {
      ...defaultTeamOptions,
      timeRange,
      sort: 'team_asc',
    });

    expect(search).toHaveBeenCalledWith(
      ['team-productivity'],
      '',
      expect.objectContaining({
        filters: `(__meta.range:"${timeRange}") AND (__meta.outputType:"all")`,
      }),
    );
  });

  it('returns team productivity for a specific output type', async () => {
    await getTeamProductivity(algoliaSearchClient, {
      ...defaultTeamOptions,
      outputType: 'public',
    });

    expect(search).toHaveBeenCalledWith(
      ['team-productivity'],
      '',
      expect.objectContaining({
        filters: `(__meta.range:"30d") AND (__meta.outputType:"public")`,
      }),
    );
  });

  it('should pass the search query to Algolia', async () => {
    await getTeamProductivity(algoliaSearchClient, {
      ...defaultTeamOptions,
      tags: ['Alessi'],
    });
    expect(search).toHaveBeenCalledWith(
      ['team-productivity'],
      '',
      expect.objectContaining({
        tagFilters: [['Alessi']],
      }),
    );
  });
});

describe('getTeamProductivityPerformance', () => {
  beforeEach(() => {
    search.mockReset();
    search.mockResolvedValue(
      createAlgoliaResponse<'analytics', 'team-productivity-performance'>([
        {
          ...performanceByDocumentType,
          objectID: '12',
          __meta: { type: 'team-productivity-performance', range: '30d' },
        },
      ]),
    );
  });

  it('returns successfully fetched team productivity performance', async () => {
    const result = await getTeamProductivityPerformance(algoliaSearchClient, {
      timeRange: '30d',
      outputType: 'all',
    });

    expect(result).toEqual(
      expect.objectContaining(teamProductivityPerformance),
    );
  });

  it.each`
    range                        | timeRange
    ${'Last 30 days'}            | ${'30d'}
    ${'Last 90 days'}            | ${'90d'}
    ${'This year (Jan-Today)'}   | ${'current-year'}
    ${'Last 12 months'}          | ${'last-year'}
    ${'Since Hub Launch (2020)'} | ${'all'}
  `(
    'returns team productivity performance for $range',
    async ({ timeRange }: { timeRange: TimeRangeOption }) => {
      await getTeamProductivityPerformance(algoliaSearchClient, {
        timeRange,
        outputType: 'all',
      });

      expect(search).toHaveBeenCalledWith(
        ['team-productivity-performance'],
        '',
        expect.objectContaining({
          filters: `(__meta.range:"${timeRange}") AND (__meta.outputType:"all")`,
        }),
      );
    },
  );
});

describe('getUserProductivityPerformance', () => {
  beforeEach(() => {
    search.mockReset();

    search.mockResolvedValue(
      createAlgoliaResponse<'analytics', 'user-productivity-performance'>([
        {
          ...userProductivityPerformance,
          objectID: '1',
          __meta: {
            type: 'user-productivity-performance',
            range: '30d',
            documentCategory: 'all',
          },
        },
      ]),
    );
  });

  it('returns successfully fetched user productivity performance', async () => {
    const result = await getUserProductivityPerformance(algoliaSearchClient, {
      timeRange: '30d',
      documentCategory: 'all',
    });
    expect(result).toEqual(
      expect.objectContaining(userProductivityPerformance),
    );
  });

  it.each`
    range                        | timeRange
    ${'Last 30 days'}            | ${'30d'}
    ${'Last 90 days'}            | ${'90d'}
    ${'This year (Jan-Today)'}   | ${'current-year'}
    ${'Last 12 months'}          | ${'last-year'}
    ${'Since Hub Launch (2020)'} | ${'all'}
  `(
    'returns team productivity performance for $range',
    async ({ timeRange }: { timeRange: TimeRangeOption }) => {
      await getUserProductivityPerformance(algoliaSearchClient, {
        timeRange,
        documentCategory: 'all',
      });

      expect(search).toHaveBeenCalledWith(
        ['user-productivity-performance'],
        '',
        expect.objectContaining({
          filters: `(__meta.range:"${timeRange}") AND (__meta.documentCategory:"all")`,
        }),
      );
    },
  );
});
