import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config as authConfig } from '@asap-hub/auth';

import { cms } from '../../../src/config';
import { handler } from '../../../src/handlers/users/fetch-by-id';
import { buildGraphQLQueryFetchUser } from '../../../src/controllers/users';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';

describe('GET /users/{id}', () => {
  test("return 400 when id isn't present", async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });

  test("returns 404 when id doesn't exist", async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);

    identity()
      .post(`/api/content/${cms.appName}/graphql`, {
        query: buildGraphQLQueryFetchUser('not-found'),
      })
      .reply(200, {
        data: {
          findUsersContent: null,
        },
      });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          id: 'not-found',
        },
        headers: {
          Authorization: `Bearer token`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(404);
    expect(nock.isDone()).toBe(true);
  });
});
