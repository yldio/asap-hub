import { AlgoliaSearchClient, ClientSearchResponse } from '@asap-hub/algolia';
import {
  teamProductivityPerformance,
  userProductivityPerformance,
} from '@asap-hub/fixtures';
import {
  TeamProductivityAlgoliaResponse,
  TimeRangeOption,
  UserProductivityAlgoliaResponse,
} from '@asap-hub/model';
import nock from 'nock';

import { createAlgoliaResponse } from '../../../__fixtures__/algolia';
import {
  getTeamProductivity,
  getTeamProductivityPerformance,
  getUserProductivity,
  getUserProductivityPerformance,
  ProductivityListOptions,
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

const defaultOptions: ProductivityListOptions = {
  pageSize: null,
  currentPage: null,
  timeRange: '30d',
  sort: 'user_asc',
  tags: [],
};

const userProductivityResponse: UserProductivityAlgoliaResponse = {
  id: '1',
  objectID: '1-user-productivity-30d',
  name: 'Test User',
  isAlumni: false,
  teams: [
    {
      id: '1',
      team: 'Team A',
      isTeamInactive: false,
      isUserInactiveOnTeam: false,
      role: 'Collaborating PI',
    },
  ],
  asapOutput: 1,
  asapPublicOutput: 2,
  ratio: '0.50',
  asapArticleOutput: 0,
  asapArticlePublicOutput: 0,
  articleRatio: '0.00',
  asapBioinformaticsOutput: 0,
  asapBioinformaticsPublicOutput: 0,
  bioinformaticsRatio: '0.00',
  asapDatasetOutput: 0,
  asapDatasetPublicOutput: 0,
  datasetRatio: '0.00',
  asapLabResourceOutput: 0,
  asapLabResourcePublicOutput: 0,
  labResourceRatio: '0.00',
  asapProtocolOutput: 0,
  asapProtocolPublicOutput: 0,
  protocolRatio: '0.00',
};
const teamProductivityResponse: TeamProductivityAlgoliaResponse = {
  id: '1',
  objectID: '1-team-productivity-30d',
  name: 'Test Team',
  isInactive: false,
  Article: 1,
  Bioinformatics: 2,
  Dataset: 3,
  'Lab Resource': 4,
  Protocol: 5,
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
      defaultOptions,
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
      ...defaultOptions,
      timeRange,
    });

    expect(search).toHaveBeenCalledWith(
      ['user-productivity'],
      '',
      expect.objectContaining({
        filters: `__meta.range:"${timeRange}"`,
      }),
    );
  });

  it('should pass the search query to Algolia', async () => {
    await getUserProductivity(algoliaSearchClient, {
      ...defaultOptions,
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
      ...defaultOptions,
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
      ...defaultOptions,
      timeRange,
      sort: 'team_asc',
    });

    expect(search).toHaveBeenCalledWith(
      ['team-productivity'],
      '',
      expect.objectContaining({
        filters: `__meta.range:"${timeRange}"`,
      }),
    );
  });

  it('should pass the search query to Algolia', async () => {
    await getTeamProductivity(algoliaSearchClient, {
      ...defaultOptions,
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
          ...teamProductivityPerformance,
          objectID: '12',
          __meta: { type: 'team-productivity-performance', range: '30d' },
        },
      ]),
    );
  });

  it('returns successfully fetched team productivity performance', async () => {
    const result = await getTeamProductivityPerformance(
      algoliaSearchClient,
      '30d',
    );
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
      await getTeamProductivityPerformance(algoliaSearchClient, timeRange);

      expect(search).toHaveBeenCalledWith(
        ['team-productivity-performance'],
        '',
        expect.objectContaining({
          filters: `__meta.range:"${timeRange}"`,
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
          __meta: { type: 'user-productivity-performance', range: '30d' },
        },
      ]),
    );
  });

  it('returns successfully fetched user productivity performance', async () => {
    const result = await getUserProductivityPerformance(
      algoliaSearchClient,
      '30d',
    );
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
      await getUserProductivityPerformance(algoliaSearchClient, timeRange);

      expect(search).toHaveBeenCalledWith(
        ['user-productivity-performance'],
        '',
        expect.objectContaining({
          filters: `__meta.range:"${timeRange}"`,
        }),
      );
    },
  );
});
