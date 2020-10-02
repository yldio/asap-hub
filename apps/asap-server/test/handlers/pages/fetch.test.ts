import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';

import { cms } from '../../../src/config';
import { handler } from '../../../src/handlers/pages/fetch';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';

describe('Get /pages/{path+}', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 200 when page is found', async () => {
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/pages`)
      .query({
        q: JSON.stringify({
          take: 1,
          filter: {
            path: 'data.path.iv',
            op: 'eq',
            value: '/privacy-policy',
          },
        }),
      })
      .reply(200, {
        total: 1,
        items: [
          {
            data: {
              path: '/privacy-policy',
              text: '<h1>Privacy Policy</h1>',
              title: 'Privacy Policy',
            },
          },
        ],
      });

    const res = (await handler(
      apiGatewayEvent({
        pathParameters: {
          path: 'privacy-policy',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
  });

  test("returns 404 when page isn't found", async () => {
    nock(cms.baseUrl)
      .get(`/api/content/${cms.appName}/pages`)
      .query({
        q: JSON.stringify({
          take: 1,
          filter: {
            path: 'data.path.iv',
            op: 'eq',
            value: '/not-found',
          },
        }),
      })
      .reply(404);

    const res = (await handler(
      apiGatewayEvent({
        pathParameters: {
          path: 'not-found',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(404);
  });
});
