import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config } from '@asap-hub/squidex';

import { handler } from '../../../src/handlers/users/fetch-by-id';
import { buildGraphQLQueryFetchUser } from '../../../src/controllers/users';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';

jest.mock('../../../src/utils/validate-token');

describe('GET /users/{id}', () => {
  test("return 400 when id isn't present", async () => {
    const result = (await handler(
      apiGatewayEvent({}),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });

  test("returns 404 when id doesn't exist", async () => {
    identity()
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchUser('not-found'),
      })
      .reply(200, {
        data: {
          findUsersContent: null,
        },
      });

    const result = (await handler(
      apiGatewayEvent({
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
