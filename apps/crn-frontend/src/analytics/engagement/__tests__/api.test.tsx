import {
  AlgoliaSearchClient,
  ClientSearchResponse,
  createAlgoliaResponse,
} from '@asap-hub/algolia';
import { listEngagementResponse } from '@asap-hub/fixtures';
import { MeetingRepAttendanceResponse } from '@asap-hub/model';
import nock from 'nock';

import {
  EngagementListOptions,
  getEngagement,
  getMeetingRepAttendance,
  MeetingRepAttendanceOptions,
} from '../api';
import { OpensearchClient } from '../../utils/opensearch';

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
  timeRange: 'all',
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

describe('getMeetingRepAttendance', () => {
  const defaultAttendanceOptions: MeetingRepAttendanceOptions = {
    pageSize: null,
    currentPage: null,
    tags: [],
    sort: 'team_asc',
    timeRange: 'all',
  };
  const defaultAttendanceData = {
    teamId: 'team-id-1',
    teamName: 'Alessi',
    isTeamInactive: false,
    attendancePercentage: 34,
    limitedData: false,
    timeRange: 'all',
  } as MeetingRepAttendanceResponse;
  const defaultResponse = {
    items: [defaultAttendanceData],
    total: 1,
  };

  let mockOpensearchClient: jest.Mocked<
    OpensearchClient<MeetingRepAttendanceResponse>
  >;

  beforeEach(() => {
    mockOpensearchClient = {
      search: jest.fn(),
    } as unknown as jest.Mocked<OpensearchClient<MeetingRepAttendanceResponse>>;
  });

  it('should not default to any search tags, specific page or limit hits per page', async () => {
    mockOpensearchClient.search.mockResolvedValue(defaultResponse);

    await getMeetingRepAttendance(
      mockOpensearchClient,
      defaultAttendanceOptions,
    );

    expect(mockOpensearchClient.search).toHaveBeenCalledWith(
      [],
      null,
      null,
      'all',
      'teams',
    );
  });

  it('should pass the options if provided to search', async () => {
    mockOpensearchClient.search.mockResolvedValue(defaultResponse);

    await getMeetingRepAttendance(mockOpensearchClient, {
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
      'teams',
    );
  });

  it.each`
    range                        | timeRange
    ${'Last 30 days'}            | ${'30d'}
    ${'Last 90 days'}            | ${'90d'}
    ${'This year (Jan-Today)'}   | ${'current-year'}
    ${'Last 12 months'}          | ${'last-year'}
    ${'Since Hub Launch (2020)'} | ${'all'}
  `('returns os champion data for $range', async ({ timeRange }) => {
    mockOpensearchClient.search.mockResolvedValue(defaultResponse);

    await getMeetingRepAttendance(mockOpensearchClient, {
      ...defaultAttendanceOptions,
      timeRange,
    });

    expect(mockOpensearchClient.search).toHaveBeenCalledWith(
      [],
      null,
      null,
      timeRange,
      'teams',
    );
  });

  it('should return successfully fetched os champion data', async () => {
    mockOpensearchClient.search.mockResolvedValue(defaultResponse);
    const analyticsOSChampion = await getMeetingRepAttendance(
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
        items: [defaultAttendanceData],
        total: 1,
      }),
    );
  });
});
