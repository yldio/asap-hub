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
import { OpensearchClient } from '../../utils/opensearch';

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
          objectID: undefined as unknown as string,
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

  it('returns user productivity for a specific document category', async () => {
    await getUserProductivity(algoliaSearchClient, {
      ...defaultUserOptions,
      documentCategory: 'article',
    });

    expect(search).toHaveBeenCalledWith(
      ['user-productivity'],
      '',
      expect.objectContaining({
        filters: `(__meta.range:"30d") AND (__meta.documentCategory:"article")`,
      }),
    );
  });

  describe('with OpensearchClient', () => {
    let opensearchClient: OpensearchClient<typeof userProductivityResponse>;
    let searchSpy: jest.SpyInstance;

    beforeEach(() => {
      opensearchClient = new OpensearchClient(
        'user-productivity',
        'Bearer test-token',
      );
      searchSpy = jest.spyOn(opensearchClient, 'search').mockResolvedValue({
        items: [userProductivityResponse],
        total: 1,
      });
    });

    afterEach(() => {
      searchSpy.mockRestore();
    });

    it('calls opensearch client with correct parameters', async () => {
      await getUserProductivity(opensearchClient, defaultUserOptions);

      expect(searchSpy).toHaveBeenCalledWith(
        [], // tags
        null, // currentPage
        null, // pageSize
        '30d', // timeRange
        'teams', // searchScope
        'all', // documentCategory
        expect.any(Array), // sort
      );
    });

    it('passes tags to opensearch client', async () => {
      await getUserProductivity(opensearchClient, {
        ...defaultUserOptions,
        tags: ['Team Alpha', 'User Beta'],
      });

      expect(searchSpy).toHaveBeenCalledWith(
        ['Team Alpha', 'User Beta'],
        null,
        null,
        '30d',
        'teams',
        'all',
        expect.any(Array),
      );
    });

    it('passes pagination parameters to opensearch client', async () => {
      await getUserProductivity(opensearchClient, {
        ...defaultUserOptions,
        currentPage: 2,
        pageSize: 20,
      });

      expect(searchSpy).toHaveBeenCalledWith(
        [],
        2,
        20,
        '30d',
        'teams',
        'all',
        expect.any(Array),
      );
    });

    it('passes time range to opensearch client', async () => {
      await getUserProductivity(opensearchClient, {
        ...defaultUserOptions,
        timeRange: '90d',
      });

      expect(searchSpy).toHaveBeenCalledWith(
        [],
        null,
        null,
        '90d',
        'teams',
        'all',
        expect.any(Array),
      );
    });

    it('passes document category to opensearch client', async () => {
      await getUserProductivity(opensearchClient, {
        ...defaultUserOptions,
        documentCategory: 'article',
      });

      expect(searchSpy).toHaveBeenCalledWith(
        [],
        null,
        null,
        '30d',
        'teams',
        'article',
        expect.any(Array),
      );
    });

    it('applies user_asc sort correctly', async () => {
      await getUserProductivity(opensearchClient, {
        ...defaultUserOptions,
        sort: 'user_asc',
      });

      expect(searchSpy).toHaveBeenCalledWith(
        [],
        null,
        null,
        '30d',
        'teams',
        'all',
        [
          {
            _script: {
              type: 'string',
              script: {
                source: "doc['name.keyword'].value.toLowerCase()",
                lang: 'painless',
              },
              order: 'asc',
            },
          },
        ],
      );
    });

    it('applies user_desc sort correctly', async () => {
      await getUserProductivity(opensearchClient, {
        ...defaultUserOptions,
        sort: 'user_desc',
      });

      const sortArg = searchSpy.mock.calls[0][6];
      // eslint-disable-next-line no-underscore-dangle
      expect(sortArg[0]._script.order).toBe('desc');
    });

    it('applies team_asc sort with nested path', async () => {
      await getUserProductivity(opensearchClient, {
        ...defaultUserOptions,
        sort: 'team_asc',
      });

      expect(searchSpy).toHaveBeenCalledWith(
        [],
        null,
        null,
        '30d',
        'teams',
        'all',
        [
          {
            _script: {
              type: 'string',
              script: {
                source: "doc['teams.team.keyword'].value.toLowerCase()",
                lang: 'painless',
              },
              order: 'asc',
              nested: { path: 'teams' },
            },
          },
        ],
      );
    });

    it('applies asap_output_asc sort correctly', async () => {
      await getUserProductivity(opensearchClient, {
        ...defaultUserOptions,
        sort: 'asap_output_asc',
      });

      expect(searchSpy).toHaveBeenCalledWith(
        [],
        null,
        null,
        '30d',
        'teams',
        'all',
        [
          {
            asapOutput: {
              order: 'asc',
            },
          },
        ],
      );
    });

    it('applies ratio_desc sort correctly', async () => {
      await getUserProductivity(opensearchClient, {
        ...defaultUserOptions,
        sort: 'ratio_desc',
      });

      expect(searchSpy).toHaveBeenCalledWith(
        [],
        null,
        null,
        '30d',
        'teams',
        'all',
        [
          {
            ratio: { order: 'desc' },
          },
        ],
      );
    });

    it('applies role_asc sort with nested path and missing value handling', async () => {
      await getUserProductivity(opensearchClient, {
        ...defaultUserOptions,
        sort: 'role_asc',
      });

      expect(searchSpy).toHaveBeenCalledWith(
        [],
        null,
        null,
        '30d',
        'teams',
        'all',
        [
          {
            'teams.role': {
              nested: { path: 'teams' },
              order: 'asc',
              missing: '_last',
            },
          },
        ],
      );
    });

    it('returns the result from opensearch client', async () => {
      const mockResult = {
        items: [userProductivityResponse],
        total: 1,
      };
      searchSpy.mockResolvedValue(mockResult);

      const result = await getUserProductivity(
        opensearchClient,
        defaultUserOptions,
      );

      expect(result).toEqual(mockResult);
    });
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
          objectID: 'team-performance-1',
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
          objectID: 'user-performance-1',
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
