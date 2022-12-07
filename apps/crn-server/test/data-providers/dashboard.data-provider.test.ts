import nock from 'nock';
import { SquidexGraphql } from '@asap-hub/squidex';
import { identity } from '../helpers/squidex';
import {
  squidexGraphqlDashboardFlatData,
  getDashboardResponse,
} from '../fixtures/dashboard.fixtures';
import { FETCH_DASHBOARD } from '../../src/queries/dashboard.queries';
import { print } from 'graphql';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';
import { getAuthToken } from '../../src/utils/auth';
import { appName, baseUrl } from '../../src/config';
import DashboardSquidexDataProvider from '../../src/data-providers/dashboard.data-provider';

describe('Dashboard Data Provider', () => {
  const squidexGraphqlClientMock = new SquidexGraphql(getAuthToken, {
    appName,
    baseUrl,
  });
  const dashboardDataProvider = new DashboardSquidexDataProvider(
    squidexGraphqlClientMock,
  );

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const dashboardMockGraphql = new DashboardSquidexDataProvider(
    squidexGraphqlClientMockServer,
  );

  beforeAll(() => {
    identity();
  });

  describe('Fetch method', () => {
    describe('with mock-server', () => {
      test('Should fetch the discover from squidex graphql', async () => {
        const result = await dashboardMockGraphql.fetch();

        const expected = getDashboardResponse();
        expect(result).toMatchObject(expected);
      });
    });

    describe('with intercepted http layer', () => {
      afterEach(() => {
        expect(nock.isDone()).toBe(true);
      });
      afterEach(() => {
        nock.cleanAll();
      });
      test('Should return an empty result when the client returns an empty array of data', async () => {
        nock(baseUrl)
          .post(`/api/content/${appName}/graphql`, {
            query: print(FETCH_DASHBOARD),
          })
          .reply(200, {
            data: {
              queryDashboardContents: [{ flatData: { news: [], pages: [] } }],
            },
          });

        const result = await dashboardDataProvider.fetch();

        expect(result).toEqual({
          news: [],
          pages: [],
        });
      });

      test('Should return an empty result when the client returns an empty array of data', async () => {
        nock(baseUrl)
          .post(`/api/content/${appName}/graphql`, {
            query: print(FETCH_DASHBOARD),
          })
          .reply(200, {
            data: {
              queryDashboardContents: [],
            },
          });

        const result = await dashboardDataProvider.fetch();

        expect(result).toEqual({
          news: [],
          pages: [],
        });
      });

      test('Should return an empty result when the client returns nulls', async () => {
        nock(baseUrl)
          .post(`/api/content/${appName}/graphql`, {
            query: print(FETCH_DASHBOARD),
          })
          .reply(200, {
            data: {
              queryDashboardContents: [
                { flatData: { news: null, pages: null } },
              ],
            },
          });

        const result = await dashboardDataProvider.fetch();

        expect(result).toEqual({
          news: [],
          pages: [],
        });
      });

      test('Should return the dashboard news', async () => {
        nock(baseUrl)
          .post(`/api/content/${appName}/graphql`, {
            query: print(FETCH_DASHBOARD),
          })
          .reply(200, {
            data: {
              queryDashboardContents: [
                {
                  flatData: squidexGraphqlDashboardFlatData(),
                },
              ],
            },
          });

        const result = await dashboardDataProvider.fetch();

        expect(result).toEqual(getDashboardResponse());
      });
    });
  });
});
