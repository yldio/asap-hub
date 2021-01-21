import nock from 'nock';

import { APIGatewayProxyResult } from 'aws-lambda';
import { config } from '@asap-hub/squidex';

import { handler } from '../../../src/handlers/dashboard/fetch';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import * as fixtures from '../news-and-events/fetch.fixtures';

jest.mock('../../../src/utils/validate-token');

describe('GET /dashboard', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 200 when no news and events exist', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
      .reply(200, {
        data: {
          queryDashboardContents: [{ flatData: { news: [], pages: [] } }],
        },
      });

    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: 'Bearer token',
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(result.body).toBeDefined();
    expect(body).toStrictEqual({
      newsAndEvents: [],
      pages: [],
    });
  });

  test('returns 200 when no news and events exist', async () => {
    nock(config.baseUrl)
      .post(`/api/content/${config.appName}/graphql`, (body) => body.query)
      .reply(200, {
        data: {
          queryDashboardContents: [{ flatData: { news: null, pages: null } }],
        },
      });

    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: 'Bearer token',
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(result.body).toBeDefined();
    expect(body).toStrictEqual({
      newsAndEvents: [],
      pages: [],
    });
  });

  test('returns 200 when no news and events exist', async () => {
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

    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: 'Bearer token',
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(result.body).toBeDefined();
    expect(body).toStrictEqual({
      newsAndEvents: fixtures.expectation.items,
      pages: [],
    });
  });
});
