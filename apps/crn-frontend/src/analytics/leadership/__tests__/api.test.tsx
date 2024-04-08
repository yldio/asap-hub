import nock from 'nock';
import { AlgoliaSearchClient, ClientSearchResponse } from '@asap-hub/algolia';
import { GetListOptions } from '@asap-hub/frontend-utils';
import { AnalyticsTeamLeadershipResponse } from '@asap-hub/model';
import { getAnalyticsLeadership } from '../api';
import { createAlgoliaResponse } from '../../../__fixtures__/algolia';

jest.mock('../../../config');

afterEach(() => {
  nock.cleanAll();
});

const teamLeadershipResponse: AnalyticsTeamLeadershipResponse = {
  id: '1',
  displayName: 'Team 1',
  workingGroupLeadershipRoleCount: 1,
  workingGroupPreviousLeadershipRoleCount: 2,
  workingGroupMemberCount: 3,
  workingGroupPreviousMemberCount: 4,
  interestGroupLeadershipRoleCount: 5,
  interestGroupPreviousLeadershipRoleCount: 6,
  interestGroupMemberCount: 7,
  interestGroupPreviousMemberCount: 8,
};

describe('getMemberships', () => {
  type Search = () => Promise<
    ClientSearchResponse<'analytics', 'team-leadership'>
  >;

  const search: jest.MockedFunction<Search> = jest.fn();

  const algoliaSearchClient = {
    search,
  } as unknown as AlgoliaSearchClient<'analytics'>;

  const defaultOptions: GetListOptions = {
    searchQuery: '',
    pageSize: null,
    currentPage: null,
    filters: new Set(),
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
      searchQuery: 'Alessi',
    });
    expect(search).toHaveBeenCalledWith(
      ['team-leadership'],
      'Alessi',
      expect.objectContaining({}),
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
