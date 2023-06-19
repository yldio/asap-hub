import {
  squidexGraphqlDashboardFlatData,
  getDashboardDataObject,
} from '../fixtures/dashboard.fixtures';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import DashboardSquidexDataProvider from '../../src/data-providers/dashboard.data-provider';
import { getSquidexGraphqlClientMock } from '../mocks/squidex-graphql-client.mock';

describe('Dashboard Data Provider', () => {
  const squidexGraphqlClientMock = getSquidexGraphqlClientMock();
  const dashboardDataProvider = new DashboardSquidexDataProvider(
    squidexGraphqlClientMock,
  );

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const dashboardMockGraphql = new DashboardSquidexDataProvider(
    squidexGraphqlClientMockServer,
  );

  describe('Fetch method', () => {
    describe('with mock-server', () => {
      test('Should fetch the dashboard from squidex graphql', async () => {
        const result = await dashboardMockGraphql.fetch();

        const expected = getDashboardDataObject();
        expect(result).toMatchObject(expected);
      });
    });

    describe('with intercepted http layer', () => {
      test('Should return an empty result when the client returns an empty array for news and pages', async () => {
        squidexGraphqlClientMock.request.mockResolvedValueOnce({
          queryDashboardContents: [{ flatData: { news: [], pages: [] } }],
        });

        const result = await dashboardDataProvider.fetch();

        expect(result).toEqual({
          news: [],
          pages: [],
        });
      });

      test('Should return an empty result when the client returns an empty array for queryDashboardContents', async () => {
        squidexGraphqlClientMock.request.mockResolvedValueOnce({
          queryDashboardContents: [],
        });

        const result = await dashboardDataProvider.fetch();

        expect(result).toEqual({
          news: [],
          pages: [],
        });
      });

      test('Should return an empty result when the client returns nulls', async () => {
        squidexGraphqlClientMock.request.mockResolvedValueOnce({
          queryDashboardContents: [{ flatData: { news: null, pages: null } }],
        });

        const result = await dashboardDataProvider.fetch();

        expect(result).toEqual({
          news: [],
          pages: [],
        });
      });

      test('Should return the dashboard news', async () => {
        squidexGraphqlClientMock.request.mockResolvedValueOnce({
          queryDashboardContents: [
            {
              flatData: squidexGraphqlDashboardFlatData(),
            },
          ],
        });

        const result = await dashboardDataProvider.fetch();

        expect(result).toEqual(getDashboardDataObject());
      });
    });
  });
});
