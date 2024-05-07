import { AlgoliaSearchClient, ClientSearchResponse } from '@asap-hub/algolia';
import {
  TeamProductivityAlgoliaResponse,
  UserProductivityAlgoliaResponse,
} from '@asap-hub/model';
import nock from 'nock';

import { createAlgoliaResponse } from '../../../__fixtures__/algolia';
import {
  getTeamProductivity,
  getUserProductivity,
  ProductivityListOptions,
} from '../api';

jest.mock('../../../config');

afterEach(() => {
  nock.cleanAll();
});

type Search = () => Promise<
  ClientSearchResponse<'analytics', 'team-productivity' | 'user-productivity'>
>;

const search: jest.MockedFunction<Search> = jest.fn();

const algoliaSearchClient = {
  search,
} as unknown as AlgoliaSearchClient<'analytics'>;

const defaultOptions: ProductivityListOptions = {
  pageSize: null,
  currentPage: null,
  timeRange: '30d',
};

const userProductivityResponse: UserProductivityAlgoliaResponse = {
  id: '1',
  objectID: '1-user-productivity-30d',
  name: 'Test User',
  isAlumni: false,
  teams: [
    {
      team: 'Team A',
      isTeamInactive: false,
      isUserInactiveOnTeam: false,
      role: 'Collaborating PI',
    },
  ],
  asapOutput: 1,
  asapPublicOutput: 2,
  ratio: '0.50',
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
    const teamProductivity = await getTeamProductivity(
      algoliaSearchClient,
      defaultOptions,
    );
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
    });

    expect(search).toHaveBeenCalledWith(
      ['team-productivity'],
      '',
      expect.objectContaining({
        filters: `__meta.range:"${timeRange}"`,
      }),
    );
  });
});
