import { FETCH_USER_COPRODUCTION } from '@asap-hub/contentful';
import { AnalyticsContentfulDataProvider } from '../../../../src/data-providers/contentful/analytics.data-provider';
import { getUserCoproductionQuery } from '../../../fixtures/analytics.fixtures';
// import { getContentfulGraphqlUser } from "../../../fixtures/users.fixtures";
import { getContentfulGraphqlClientMock } from '../../../mocks/contentful-graphql-client.mock';
const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();
const analyticsDataProvider = new AnalyticsContentfulDataProvider(
  contentfulGraphqlClientMock,
);

describe('coproduction', () => {
  beforeAll(() => {
    jest.useFakeTimers();

    jest.setSystemTime(new Date('2023-09-10T03:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  // const contentfulGraphqlClientMockServer =
  //   getContentfulGraphqlClientMockServer({
  //     Users: () => getContentfulGraphqlUser(),
  //     ResearchOutputs: () => ({
  //       addedDate: '2023-09-03T03:00:00.000Z',
  //       sharingStatus: 'Network Only',
  //       authorsCollection: {
  //         items: [
  //           {
  //             __typename: 'Users',
  //             sys: {
  //               id: 'user-id-1',
  //             },
  //           },
  //         ],
  //       },
  //     }),
  //   });

  // const analyticsDataProviderMockGraphql = new AnalyticsContentfulDataProvider(
  //   contentfulGraphqlClientMockServer,
  // );

  describe('Pagination', () => {
    test('Should apply pagination parameters', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getUserCoproductionQuery(),
      );

      await analyticsDataProvider.fetchUserCollaboration({
        take: 13,
        skip: 3,
      });

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        FETCH_USER_COPRODUCTION,
        expect.objectContaining({
          limit: 13,
          skip: 3,
        }),
      );
    });

    test('Should pass default pagination parameters', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getUserCoproductionQuery(),
      );

      await analyticsDataProvider.fetchUserCollaboration({});

      expect(contentfulGraphqlClientMock.request).toHaveBeenCalledWith(
        FETCH_USER_COPRODUCTION,
        expect.objectContaining({
          limit: 10,
          skip: 0,
        }),
      );
    });
  });
});
