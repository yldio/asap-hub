import { DateTime } from 'luxon';
import { AnalyticsContentfulDataProvider } from '../../../../src/data-providers/contentful/analytics.data-provider';
import { getAttendanceQuery } from '../../../fixtures/analytics.fixtures';
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

  const result = await analyticsDataProvider.fetchAttendance({});

  expect(result).toEqual({
    total: 0,
    items: [],
  });
});

test('Should return zero attendance percentage and limited data when the attendance collection is empty', async () => {
  const graphqlResponse = getAttendanceQuery();
  graphqlResponse.teamsCollection!.items[0]!.linkedFrom!.attendanceCollection!.items =
    [];
  contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

  const result = await analyticsDataProvider.fetchAttendance({});

  expect(result).toEqual({
    total: 1,
    items: [
      {
        teamId: 'team-id-0',
        teamName: 'Team A',
        isTeamInactive: false,
        attendancePercentage: 0,
        limitedData: true,
        timeRange: 'all',
      },
    ],
  });
});

test('Should return the correct attendance percentage when the client returns a valid response', async () => {
  const graphqlResponse = getAttendanceQuery();
  contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

  const result = await analyticsDataProvider.fetchAttendance({});

  expect(result).toEqual({
    total: 1,
    items: [
      {
        teamId: 'team-id-0',
        teamName: 'Team A',
        isTeamInactive: false,
        attendancePercentage: 67,
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
            attendanceCollection: {
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
                  attended: true,
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
                  attended: true,
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
                  attended: false,
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
                  attended: true,
                },
              ],
            },
          },
        },
      ],
    },
  };
  contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

  const result = await analyticsDataProvider.fetchAttendance({
    filter: { timeRange: 'last-year' },
  });

  expect(result).toEqual({
    total: 1,
    items: [
      {
        teamId: 'team-id-0',
        teamName: 'Team A',
        isTeamInactive: false,
        attendancePercentage: 67,
        limitedData: false,
        timeRange: 'last-year',
      },
    ],
  });
});

test('Should handle inactive teams correctly', async () => {
  const graphqlResponse = getAttendanceQuery();
  graphqlResponse.teamsCollection!.items[0]!.inactiveSince = '2023-01-01';
  contentfulGraphqlClientMock.request.mockResolvedValueOnce(graphqlResponse);

  const result = await analyticsDataProvider.fetchAttendance({});

  expect(result).toEqual({
    total: 1,
    items: [
      {
        teamId: 'team-id-0',
        teamName: 'Team A',
        isTeamInactive: true,
        attendancePercentage: 67,
        limitedData: false,
        timeRange: 'all',
      },
    ],
  });
});
