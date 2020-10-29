import nock from 'nock';

import { APIGatewayProxyResult } from 'aws-lambda';

import { handler } from '../../../src/handlers/dashboard/fetch';
import { cms } from '../../../src/config';
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
    nock(cms.baseUrl)
      .post(`/api/content/${cms.appName}/graphql`, (body) => body.query)
      .reply(200, {
        data: {
          queryDashboardContents: [
            { data: { news: { iv: [] }, pages: { iv: [] } } },
          ],
        },
      });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
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
    nock(cms.baseUrl)
      .post(`/api/content/${cms.appName}/graphql`, (body) => body.query)
      .reply(200, {
        data: {
          queryDashboardContents: [{ data: { news: null, pages: null } }],
        },
      });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
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
    nock(cms.baseUrl)
      .post(`/api/content/${cms.appName}/graphql`, (body) => body.query)
      .reply(200, {
        data: {
          queryDashboardContents: [
            {
              data: {
                news: { iv: fixtures.newsAndEventsResponse.items },
                pages: null,
              },
            },
          ],
        },
      });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
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
