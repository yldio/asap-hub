import nock from 'nock';
import Dashboard from '../../src/controllers/dashboard';
import { config } from '@asap-hub/squidex';
import { identity } from '../helpers/squidex';
import { dashboardResponse } from "../fixtures/dashboard.fixtures";

describe('Dashboard controller', () => {
  const dashboard = new Dashboard();

  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  describe('Fetch method', () => {
    test('Should return an empty result when the client returns an empty array of data', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
        .reply(200, {
          data: {
            queryDashboardContents: [{ flatData: { news: [], pages: [] } }],
          },
        });

      const result = await dashboard.fetch();

      expect(result).toEqual({
        newsAndEvents: [],
        pages: [],
      });
    });

    test('Should return an empty result when the client returns nulls', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
        .reply(200, {
          data: {
            queryDashboardContents: [{ flatData: { news: null, pages: null } }],
          },
        });

      const result = await dashboard.fetch();

      expect(result).toEqual({
        newsAndEvents: [],
        pages: [],
      });
    });

    test('Should return the the dashboard news', async () => {
      nock(config.baseUrl)
        .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
        .reply(200, {
          data: {
            queryDashboardContents: [
              {
                flatData: {
                  news: [
                    {
                      id: 'news-and-events-1',
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
                      id: 'news-and-events-2',
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
