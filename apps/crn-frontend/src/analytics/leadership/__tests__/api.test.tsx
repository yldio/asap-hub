import nock from 'nock';
import {
  createAlgoliaResponse,
  AlgoliaSearchClient,
  ClientSearchResponse,
  AnalyticsSearchOptionsWithFiltering,
} from '@asap-hub/algolia';
import { teamLeadershipResponse } from '@asap-hub/fixtures';
import { OSChampionOpensearchResponse, SortOSChampion } from '@asap-hub/model';
import {
  AnalyticsSearchOptions,
  getAnalyticsLeadership,
  getAnalyticsOSChampion,
} from '../api';

import { OpensearchClient } from '../../utils/opensearch';

jest.mock('../../../config');

afterEach(() => {
  nock.cleanAll();
});

const defaultOptions: AnalyticsSearchOptions = {
  pageSize: null,
  currentPage: null,
  tags: [],
};

describe('getAnalyticsLeadership', () => {
  type Search = () => Promise<
    ClientSearchResponse<'analytics', 'team-leadership'>
  >;

  const search: jest.MockedFunction<Search> = jest.fn();

  const algoliaSearchClient = {
    search,
  } as unknown as AlgoliaSearchClient<'analytics'>;

  beforeEach(() => {
    search.mockReset();

    search.mockResolvedValue(
      createAlgoliaResponse<'analytics', 'team-leadership'>([
        {
          ...teamLeadershipResponse,
          objectID: teamLeadershipResponse.id,
          __meta: { type: 'team-leadership' },
        },
      ]),
    );
  });

  it('should not filter team leadership by default', async () => {
    await getAnalyticsLeadership(algoliaSearchClient, defaultOptions);

    expect(search).toHaveBeenCalledWith(
      ['team-leadership'],
      '',
      expect.objectContaining({
        filters: undefined,
      }),
    );
  });

  it('should not default to any specific page or limit hits per page', async () => {
    await getAnalyticsLeadership(algoliaSearchClient, defaultOptions);

    expect(search).toHaveBeenCalledWith(
      ['team-leadership'],
      '',
      expect.objectContaining({
        hitsPerPage: undefined,
        page: undefined,
      }),
    );
  });

  it('should pass the search query to Algolia', async () => {
    await getAnalyticsLeadership(algoliaSearchClient, {
      ...defaultOptions,
      tags: ['Alessi'],
    });
    expect(search).toHaveBeenCalledWith(
      ['team-leadership'],
      '',
      expect.objectContaining({
        tagFilters: [['Alessi']],
      }),
    );
  });

  it('should return successfully fetched team leadership', async () => {
    const analyticsLeadership = await getAnalyticsLeadership(
      algoliaSearchClient,
      defaultOptions,
    );
    expect(analyticsLeadership).toEqual(
      expect.objectContaining({
        items: [
          {
            ...teamLeadershipResponse,
            objectID: teamLeadershipResponse.id,
            __meta: { type: 'team-leadership' },
          },
        ],
        total: 1,
      }),
    );
  });
});

describe('getAnalyticsOSChampion', () => {
  const defaultOSChampionOptions: AnalyticsSearchOptionsWithFiltering<SortOSChampion> =
    {
      ...defaultOptions,
      sort: 'team_asc',
      timeRange: 'all',
    };
  const defaultOSChampionData = {
    objectID: 'object-id-1',
    teamId: 'team-id-1',
    teamName: 'Alessi',
    isTeamInactive: false,
    teamAwardsCount: 0,
    timeRange: 'all',
    users: [],
  } as OSChampionOpensearchResponse;
  const defaultResponse = {
    items: [defaultOSChampionData],
    total: 1,
  };

  let mockOpensearchClient: jest.Mocked<
    OpensearchClient<OSChampionOpensearchResponse>
  >;

  beforeEach(() => {
    mockOpensearchClient = {
      search: jest.fn(),
    } as unknown as jest.Mocked<OpensearchClient<OSChampionOpensearchResponse>>;
  });

  it('should not default to any search tags, specific page or limit hits per page', async () => {
    mockOpensearchClient.search.mockResolvedValue(defaultResponse);

    await getAnalyticsOSChampion(
      mockOpensearchClient,
      defaultOSChampionOptions,
    );

    expect(mockOpensearchClient.search).toHaveBeenCalledWith(
      [],
      null,
      null,
      'all',
    );
  });

  it('should pass the options if provided to search', async () => {
    mockOpensearchClient.search.mockResolvedValue(defaultResponse);

    await getAnalyticsOSChampion(mockOpensearchClient, {
      pageSize: 10,
      currentPage: 0,
      tags: ['Alessi'],
      timeRange: 'all',
      sort: 'team_asc',
    });

    expect(mockOpensearchClient.search).toHaveBeenCalledWith(
      ['Alessi'],
      0,
      10,
      'all',
    );
  });

  it('should return successfully fetched os champion data', async () => {
    mockOpensearchClient.search.mockResolvedValue(defaultResponse);
    const analyticsOSChampion = await getAnalyticsOSChampion(
      mockOpensearchClient,
      {
        pageSize: 10,
        currentPage: 0,
        tags: ['Alessi'],
        timeRange: 'all',
        sort: 'team_asc',
      },
    );
    expect(analyticsOSChampion).toEqual(
      expect.objectContaining({
        items: [defaultOSChampionData],
        total: 1,
      }),
    );
  });
});
