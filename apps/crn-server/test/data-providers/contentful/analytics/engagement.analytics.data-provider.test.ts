import { FETCH_ENGAGEMENT } from '@asap-hub/contentful';
import { AnalyticsContentfulDataProvider } from '../../../../src/data-providers/contentful/analytics.data-provider';
import {
  getEngagementQuery,
  getEngagementResponse,
} from '../../../fixtures/analytics.fixtures';
import { getContentfulGraphqlClientMock } from '../../../mocks/contentful-graphql-client.mock';

const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
const analyticsDataProvider = new AnalyticsContentfulDataProvider(
  contentfulGraphqlClientMock,
);

describe('fetchEngagement', () => {
  beforeAll(() => {
    jest.useFakeTimers();

    jest.setSystemTime(new Date('2024-06-13T03:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(jest.resetAllMocks);

  describe('Pagination', () => {
    test('Should apply pagination parameters', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValue(
        getEngagementQuery(),
      );

      await analyticsDataProvider.fetchEngagement({
        take: 13,
        skip: 3,
      });

      expect(contentfulGraphqlClientMock.request.mock.calls).toEqual([
        [
          FETCH_ENGAGEMENT,
          expect.objectContaining({
            limit: 5,
            skip: 3,
          }),
        ],
        [
          FETCH_ENGAGEMENT,
          expect.objectContaining({
            limit: 5,
            skip: 8,
          }),
        ],
        [
          FETCH_ENGAGEMENT,
          expect.objectContaining({
            limit: 5,
            skip: 13,
          }),
        ],
      ]);
    });

    test('Should pass default pagination parameters', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValue(
        getEngagementQuery(),
      );

      await analyticsDataProvider.fetchEngagement({});

      expect(contentfulGraphqlClientMock.request.mock.calls).toEqual([
        [
          FETCH_ENGAGEMENT,
          expect.objectContaining({
            limit: 5,
            skip: 0,
          }),
        ],
        [
          FETCH_ENGAGEMENT,
          expect.objectContaining({
            limit: 5,
            skip: 5,
          }),
        ],
      ]);
    });
  });

  test('Should return an empty result when the client returns an empty list', async () => {
    contentfulGraphqlClientMock.request.mockResolvedValue({
      teamsCollection: {
        items: [],
        total: 0,
      },
    });

    const result = await analyticsDataProvider.fetchEngagement({});

    expect(result).toEqual({
      total: 0,
      items: [],
    });
  });

  test('Should return an empty result when the client returns teamsCollection as null', async () => {
    contentfulGraphqlClientMock.request.mockResolvedValue({
      teamsCollection: null,
    });

    const result = await analyticsDataProvider.fetchEngagement({});

    expect(result).toEqual({
      total: 0,
      items: [],
    });
  });

  test('Should return the count of events as zero when the client returns eventSpeakersCollection as null', async () => {
    const graphqlResponse = getEngagementQuery();
    graphqlResponse.teamsCollection!.items[0]!.linkedFrom!.eventSpeakersCollection =
      null;
    contentfulGraphqlClientMock.request
      .mockResolvedValueOnce(graphqlResponse)
      .mockResolvedValueOnce({});

    const result = await analyticsDataProvider.fetchEngagement({});

    expect(result).toEqual({
      total: 1,
      items: [
        {
          id: 'team-id-0',
          name: 'Team A',
          inactiveSince: null,
          memberCount: 4,
          eventCount: 0,
          totalSpeakerCount: 0,
          uniqueAllRolesCount: 0,
          uniqueKeyPersonnelCount: 0,
        },
      ],
    });
  });

  test('Should return the number of events published in the last month', async () => {
    contentfulGraphqlClientMock.request
      .mockResolvedValueOnce(getEngagementQuery())
      .mockResolvedValueOnce({});

    const result = await analyticsDataProvider.fetchEngagement({});

    expect(result).toEqual({
      total: 1,
      items: [getEngagementResponse()],
    });
  });
});
