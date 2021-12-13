import nock from 'nock';
import Dashboard from '../../src/controllers/dashboard';
import { config, SquidexGraphql } from '@asap-hub/squidex';
import { identity } from '../helpers/squidex';
import {
  dashboardResponse,
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

        expect(result).toMatchObject(squidexGraphqlDashboardResponse);
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
                  flatData: {
                    news: [
                      {
                        id: 'news-1',
                        flatData: {
                          title: 'News 1',
                          type: 'News',
                          shortText: 'Short text of news 1',
                          text: '<p>text</p>',
                          thumbnail: [{ id: 'thumbnail-uuid1' }],
                        },
                        created: '2020-09-08T16:35:28Z',
                      },
                      {
                        id: 'news-2',
                        flatData: {
                          title: 'Event 2',
                          type: 'Event',
                          shortText: 'Short text of event 2',
                          text: '<p>text</p>',
                          thumbnail: [{ id: 'thumbnail-uuid2' }],
                        },
                        created: '2020-09-16T14:31:19Z',
                      },
                    ],
                    pages: null,
                  },
                },
              ],
            },
          });

        const result = await dashboard.fetch();

        expect(result).toEqual(dashboardResponse);
      });
    });
  });
});
