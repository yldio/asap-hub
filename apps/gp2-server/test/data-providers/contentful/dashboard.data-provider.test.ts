import { getGP2ContentfulGraphqlClientMockServer } from '@asap-hub/contentful';
import { GraphQLError } from 'graphql';
import { DashboardContentfulDataProvider } from '../../../src/data-providers/contentful/dashboard.data-provider';
import {
  getListDashboardDataObject,
  getContentfulGraphqlDashboard,
  getContentfulDashboardGraphqlResponse,
} from '../../fixtures/dashboard.fixtures';
import { getContentfulGraphqlClientMock } from '../../mocks/contentful-graphql-client.mock';

describe('Dashboard data provider', () => {
  const contentfulGraphqlClientMock = getContentfulGraphqlClientMock();

  const dashboardDataProvider = new DashboardContentfulDataProvider(
    contentfulGraphqlClientMock,
  );

  const contentfulGraphqlClientMockServer =
    getGP2ContentfulGraphqlClientMockServer({
      LatestStats: () => getContentfulGraphqlDashboard(),
    });

  const dashboardDataProviderMockGraphql = new DashboardContentfulDataProvider(
    contentfulGraphqlClientMockServer,
  );

  afterEach(jest.resetAllMocks);

  describe('Fetch method', () => {
    test('Should fetch the list of latest stats for dashboard from Contentful GraphQl', async () => {
      const result = await dashboardDataProviderMockGraphql.fetch();

      expect(result).toMatchObject(getListDashboardDataObject());
    });

    test('Should return an empty result when no news exist', async () => {
      const contentfulGraphQLResponse = getContentfulDashboardGraphqlResponse();
      contentfulGraphQLResponse.latestStatsCollection!.total = 0;
      contentfulGraphQLResponse.latestStatsCollection!.items = [];

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await dashboardDataProvider.fetch();

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should throw an error with a specific error message when the graphql client throws one', async () => {
      contentfulGraphqlClientMock.request.mockRejectedValueOnce(
        new GraphQLError('some error message'),
      );

      await expect(dashboardDataProvider.fetch()).rejects.toThrow(
        'some error message',
      );
    });

    test('Should return an empty result when the query is returned as null', async () => {
      const contentfulGraphQLResponse = getContentfulDashboardGraphqlResponse();
      contentfulGraphQLResponse.latestStatsCollection = null;

      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        contentfulGraphQLResponse,
      );

      const result = await dashboardDataProvider.fetch();

      expect(result).toEqual({
        items: [],
        total: 0,
      });
    });

    test('Should return dashboard stats', async () => {
      contentfulGraphqlClientMock.request.mockResolvedValueOnce(
        getContentfulDashboardGraphqlResponse(),
      );
      const result = await dashboardDataProvider.fetch();

      expect(result).toEqual(getListDashboardDataObject());
    });
  });

  describe('Fetch-by-id method', () => {
    test('Should throw as not implemented', async () => {
      expect.assertions(1);
      await expect(dashboardDataProvider.fetchById()).rejects.toThrow(
        /Method not implemented/i,
      );
    });
  });
});
