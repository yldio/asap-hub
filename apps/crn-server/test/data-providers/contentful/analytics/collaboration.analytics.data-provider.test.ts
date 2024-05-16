import { FETCH_USER_COLLABORATION } from '@asap-hub/contentful';
import { AnalyticsContentfulDataProvider } from '../../../../src/data-providers/contentful/analytics.data-provider';
import { getUserCollaborationQuery } from '../../../fixtures/analytics.fixtures';
import { getContentfulGraphqlClientMock } from '../../../mocks/contentful-graphql-client.mock';
const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
const analyticsDataProvider = new AnalyticsContentfulDataProvider(
  contentfulGraphqlClientMock,
);

describe('collaboration', () => {
  beforeAll(() => {
    jest.useFakeTimers();

    jest.setSystemTime(new Date('2023-09-10T03:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Pagination', () => {
    test('Should apply pagination parameters and split query accordingly', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValue(
        getUserCollaborationQuery(),
      );

      await analyticsDataProvider.fetchUserCollaboration({
        take: 13,
        skip: 3,
      });

      expect(contentfulGraphqlClientMock.request.mock.calls).toEqual([
        [
          FETCH_USER_COLLABORATION,
          expect.objectContaining({
            limit: 5,
            skip: 3,
          }),
        ],
        [
          FETCH_USER_COLLABORATION,
          expect.objectContaining({
            limit: 5,
            skip: 8,
          }),
        ],
        [
          FETCH_USER_COLLABORATION,
          expect.objectContaining({
            limit: 5,
            skip: 13,
          }),
        ],
      ]);
    });

    test('Should pass default pagination parameters and split query', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValue(
        getUserCollaborationQuery(),
      );

      await analyticsDataProvider.fetchUserCollaboration({});

      expect(contentfulGraphqlClientMock.request.mock.calls).toEqual([
        [
          FETCH_USER_COLLABORATION,
          expect.objectContaining({
            limit: 5,
            skip: 0,
          }),
        ],
        [
          FETCH_USER_COLLABORATION,
          expect.objectContaining({
            limit: 5,
            skip: 5,
          }),
        ],
      ]);
    });
  });
});
