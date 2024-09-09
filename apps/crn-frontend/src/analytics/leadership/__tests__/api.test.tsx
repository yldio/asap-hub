import nock from 'nock';
import {
  createAlgoliaResponse,
  AlgoliaSearchClient,
  ClientSearchResponse,
} from '@asap-hub/algolia';
import { teamLeadershipResponse } from '@asap-hub/fixtures';
import { AnalyticsSearchOptions, getAnalyticsLeadership } from '../api';

jest.mock('../../../config');

afterEach(() => {
  nock.cleanAll();
});

describe('getMemberships', () => {
  type Search = () => Promise<
    ClientSearchResponse<'analytics', 'team-leadership'>
  >;

  const search: jest.MockedFunction<Search> = jest.fn();

  const algoliaSearchClient = {
    search,
  } as unknown as AlgoliaSearchClient<'analytics'>;

  const defaultOptions: AnalyticsSearchOptions = {
    pageSize: null,
    currentPage: null,
    tags: [],
  };

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
