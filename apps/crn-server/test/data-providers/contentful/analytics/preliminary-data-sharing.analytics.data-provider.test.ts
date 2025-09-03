import { DateTime } from 'luxon';
import { AnalyticsContentfulDataProvider } from '../../../../src/data-providers/contentful/analytics.data-provider';
import { getPreliminaryDataSharingQuery } from '../../../fixtures/analytics.fixtures';
import { getContentfulGraphqlClientMock } from '../../../mocks/contentful-graphql-client.mock';

const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
const analyticsDataProvider = new AnalyticsContentfulDataProvider(
  contentfulGraphqlClientMock,
);

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

beforeEach(async () => {
  const eventStartDate = DateTime.fromISO(
    '2024-12-31T00:00:00.000Z',
  ).toJSDate();
  jest.setSystemTime(eventStartDate);
});

afterEach(() => {
  jest.resetAllMocks();
});

test('Should return an empty result when the client returns an empty list', async () => {
  contentfulGraphqlClientMock.request.mockResolvedValueOnce({
    teamsCollection: {
      items: [],
      total: 0,
    },
  });

  const result = await analyticsDataProvider.fetchPreliminaryDataSharing({});

  expect(result).toEqual({
    total: 0,
    items: [],
  });
});

test('Should return zero percent shared and limited data when the preliminary data sharing collection is empty', async () => {
  const graphqlResponse = getPreliminaryDataSharingQuery();
  graphqlResponse.teamsCollection!.items[0]!.linkedFrom!.preliminaryDataSharingCollection!.items =
    [];
  contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

  const result = await analyticsDataProvider.fetchPreliminaryDataSharing({});

  expect(result).toEqual({
    total: 1,
    items: [
      {
        teamId: 'team-id-0',
        teamName: 'Team A',
        isTeamInactive: false,
        percentShared: 0,
        limitedData: true,
        timeRange: 'all',
      },
    ],
  });
});

test('Should return the correct percent shared when the client returns a valid response', async () => {
  const graphqlResponse = getPreliminaryDataSharingQuery();
  contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

  const result = await analyticsDataProvider.fetchPreliminaryDataSharing({});

  expect(result).toEqual({
    total: 1,
    items: [
      {
        teamId: 'team-id-0',
        teamName: 'Team A',
        isTeamInactive: false,
        percentShared: 67,
        limitedData: false,
        timeRange: 'all',
      },
    ],
  });
});

test('Should filter by time range when last-year filter is applied', async () => {
  const graphqlResponse = {
    teamsCollection: {
      total: 1,
      items: [
        {
          sys: {
            id: 'team-id-0',
          },
          displayName: 'Team A',
          inactiveSince: null,
          linkedFrom: {
            preliminaryDataSharingCollection: {
              total: 4,
              items: [
                {
                  linkedFrom: {
                    eventsCollection: {
                      items: [
                        {
                          startDate: '2024-05-07T00:00:00.000Z',
                        },
                      ],
                    },
                  },
                  preliminaryDataShared: true,
                },
                {
                  linkedFrom: {
                    eventsCollection: {
                      items: [
                        {
                          startDate: '2024-02-20T00:00:00.000Z',
                        },
                      ],
                    },
                  },
                  preliminaryDataShared: true,
                },
                {
                  linkedFrom: {
                    eventsCollection: {
                      items: [
                        {
                          startDate: '2024-10-03T00:00:00.000Z',
                        },
                      ],
                    },
                  },
                  preliminaryDataShared: false,
                },
                {
                  linkedFrom: {
                    eventsCollection: {
                      items: [
                        {
                          startDate: '2022-12-30T00:00:00.000Z',
                        },
                      ],
                    },
                  },
                  preliminaryDataShared: true,
                },
              ],
            },
          },
        },
      ],
    },
  };
  contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

  const result = await analyticsDataProvider.fetchPreliminaryDataSharing({
    filter: { timeRange: 'last-year' },
  });

  expect(result).toEqual({
    total: 1,
    items: [
      {
        teamId: 'team-id-0',
        teamName: 'Team A',
        isTeamInactive: false,
        percentShared: 67,
        limitedData: false,
        timeRange: 'last-year',
      },
    ],
  });
});

test('Should handle inactive teams correctly', async () => {
  const graphqlResponse = getPreliminaryDataSharingQuery();
  graphqlResponse.teamsCollection!.items[0]!.inactiveSince = '2023-01-01';
  contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

  const result = await analyticsDataProvider.fetchPreliminaryDataSharing({});

  expect(result).toEqual({
    total: 1,
    items: [
      {
        teamId: 'team-id-0',
        teamName: 'Team A',
        isTeamInactive: true,
        percentShared: 67,
        limitedData: false,
        timeRange: 'all',
      },
    ],
  });
});
