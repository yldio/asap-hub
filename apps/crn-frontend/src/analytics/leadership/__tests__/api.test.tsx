import nock from 'nock';
import {
  createAlgoliaResponse,
  AlgoliaSearchClient,
  ClientSearchResponse,
} from '@asap-hub/algolia';
import { teamLeadershipResponse } from '@asap-hub/fixtures';
import {
  AnalyticsSearchOptions,
  getAnalyticsLeadership,
  getAnalyticsOSChampion,
} from '../api';
import { API_BASE_URL } from '../../../config';
import { OpenSearchHit } from 'src/analytics/utils/api';
import { OSChampionDataObject } from '@asap-hub/model';

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
  const defaultOSChampionData = {
    teamId: 'team-id-1',
    teamName: 'Test Team',
    isTeamInactive: false,
    teamAwardsCount: 0,
    users: [],
  };
  const defaultResponse = {
    hits: {
      total: {
        value: 1,
      },
      hits: [
        {
          _source: defaultOSChampionData,
        } as unknown as OpenSearchHit<OSChampionDataObject>,
      ],
    },
  };

  const defaultRequest = {
    query: {
      match_all: {},
    },
    size: 10,
    from: 0,
  };
  it('makes an authorized POST request for os champion analytics data', async () => {
    nock(API_BASE_URL, { reqheaders: { authorization: 'Bearer x' } })
      .post('/opensearch/search/os-champion')
      .reply(200, defaultResponse);

    await getAnalyticsOSChampion('Bearer x', defaultOptions);
    expect(nock.isDone()).toBe(true);
  });

  it('passes the post object in the body', async () => {
    nock(API_BASE_URL)
      .post('/opensearch/search/os-champion', defaultRequest)
      .reply(200, defaultResponse);

    await getAnalyticsOSChampion('Bearer x', defaultOptions);
    expect(nock.isDone()).toBe(true);
  });

  it('should return successfully fetched os champion data', async () => {
    nock(API_BASE_URL)
      .post('/opensearch/search/os-champion', defaultRequest)
      .reply(200, defaultResponse);

    expect(await getAnalyticsOSChampion('Bearer x', defaultOptions)).toEqual({
      total: 1,
      items: [defaultOSChampionData],
    });
  });

  it('errors for an error status', async () => {
    nock(API_BASE_URL)
      .post('/opensearch/search/os-champion', defaultRequest)
      .reply(500, {});

    await expect(
      getAnalyticsOSChampion('Bearer x', defaultOptions),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Failed to search os-champion index. Expected status 2xx. Received status 500."`,
    );
  });
});
