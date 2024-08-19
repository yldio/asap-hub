import {
  AlgoliaSearchClient,
  ClientSearchResponse,
  createAlgoliaResponse,
} from '@asap-hub/algolia';
import { ListEngagementAlgoliaResponse } from '@asap-hub/model';
import nock from 'nock';

import { EngagementListOptions, getEngagement } from '../api';

jest.mock('../../../config');

afterEach(() => {
  nock.cleanAll();
});

type Search = () => Promise<ClientSearchResponse<'analytics', 'engagement'>>;

const search: jest.MockedFunction<Search> = jest.fn();

const algoliaSearchClient = {
  search,
} as unknown as AlgoliaSearchClient<'analytics'>;

const defaultOptions: EngagementListOptions = {
  pageSize: 10,
  currentPage: 0,
  tags: [],
};

const listEngagementResponse: ListEngagementAlgoliaResponse = {
  total: 1,
  items: [
    {
      id: '1',
      name: 'Test Team',
      inactiveSince: null,
      memberCount: 5,
      eventCount: 2,
      totalSpeakerCount: 3,
      uniqueAllRolesCount: 2,
      uniqueAllRolesCountPercentage: 67,
      uniqueKeyPersonnelCount: 1,
      uniqueKeyPersonnelCountPercentage: 33,
      objectID: 'engagement-algolia-id',
    },
  ],
};

describe('getEngagement', () => {
  beforeEach(() => {
    search.mockReset();

    search.mockResolvedValue(
      createAlgoliaResponse<'analytics', 'engagement'>([
        {
          ...listEngagementResponse.items[0]!,
          __meta: { type: 'engagement' },
        },
      ]),
    );
  });

  it('returns successfully fetched engagement', async () => {
    const engagement = await getEngagement(algoliaSearchClient, defaultOptions);

    expect(engagement).toMatchObject(listEngagementResponse);
  });

  it('should pass the search query to Algolia', async () => {
    await getEngagement(algoliaSearchClient, {
      ...defaultOptions,
      tags: ['Alessi'],
    });
    expect(search).toHaveBeenCalledWith(
      ['engagement'],
      '',
      expect.objectContaining({
        tagFilters: [['Alessi']],
      }),
    );
  });
});
