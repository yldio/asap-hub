import nock from 'nock';
import Dashboard from '../../src/controllers/dashboard';
import { config, SquidexGraphql } from '@asap-hub/squidex';
import { identity } from '../helpers/squidex';
import {
  squidexGraphqlDashboardFlatData,
  squidexGraphqlDashboardResponse,
} from '../fixtures/dashboard.fixtures';
import { FETCH_DASHBOARD } from '../../src/queries/dashboard.queries';
import { print } from 'graphql';
import { getSquidexGraphqlClientMockServer } from '../mocks/squidex-graphql-client-with-server.mock';

describe('Dashboard controller', () => {
  const squidexGraphqlClientMock = new SquidexGraphql();
  const dashboard = new Dashboard(squidexGraphqlClientMock);

  const squidexGraphqlClientMockServer = getSquidexGraphqlClientMockServer();
  const dashboardMockGraphql = new Dashboard(squidexGraphqlClientMockServer);

  beforeAll(() => {
    identity();
  });

  describe('Fetch method', () => {
    describe('with mock-server', () => {
      test('Should fetch the discover from squidex graphql', async () => {
        const result = await dashboardMockGraphql.fetch();

        const expected = squidexGraphqlDashboardResponse();
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
        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_DASHBOARD),
          })
          .reply(200, {
            data: {
              queryDashboardContents: [{ flatData: { news: [], pages: [] } }],
            },
          });

        const result = await dashboard.fetch();

        expect(result).toEqual({
          news: [],
          pages: [],
        });
      });

      test('Should return an empty result when the client returns an empty array of data', async () => {
        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_DASHBOARD),
          })
          .reply(200, {
            data: {
              queryDashboardContents: [],
            },
          });

        const result = await dashboard.fetch();

        expect(result).toEqual({
          news: [],
          pages: [],
        });
      });

      test('Should return an empty result when the client returns nulls', async () => {
        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
            query: print(FETCH_DASHBOARD),
          })
          .reply(200, {
            data: {
              queryDashboardContents: [
                { flatData: { news: null, pages: null } },
              ],
            },
          });

        const result = await dashboard.fetch();

        expect(result).toEqual({
          news: [],
          pages: [],
        });
      });

      test('Should return the dashboard news', async () => {
        nock(config.baseUrl)
          .post(`/api/content/${config.appName}/graphql`, {
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

        const result = await dashboard.fetch();

        expect(result).toEqual(squidexGraphqlDashboardResponse());
      });
    });
  });
});
