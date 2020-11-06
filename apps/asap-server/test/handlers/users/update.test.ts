import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config } from '@asap-hub/squidex';

import { handler } from '../../../src/handlers/users/update';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import { patchResponse } from './update.fixtures';
import decodeToken from '../../../src/utils/validate-token';

jest.mock('../../../src/utils/validate-token');

describe('PATCH /users/{id} - validations', () => {
  test('returns 401 when Authentication header is not set', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'patch',
        pathParameters: {
          id: 'userId',
        },
        body: {
          displayName: 'Updated Name',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('returns 401 when method is not bearer', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'patch',
        headers: {
          Authorization: 'Basic token',
        },
        pathParameters: {
          id: 'userId',
        },
        body: {
          displayName: 'Updated Name',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('returns 401 when Auth0 fails to verify token', async () => {
    const mockDecodeToken = decodeToken as jest.MockedFunction<
      typeof decodeToken
    >;
    mockDecodeToken.mockRejectedValueOnce(new Error());

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'patch',
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'userId',
        },
        body: {
          displayName: 'Updated Name',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('returns 400 when payload is invalid', async () => {
    const result1 = (await handler(
      apiGatewayEvent({
        httpMethod: 'patch',
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'userId',
        },
        body: {},
      }),
    )) as APIGatewayProxyResult;

    expect(result1.statusCode).toStrictEqual(400);
  });

  test('returns 403 when user is changing other user', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'patch',
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'not-me',
        },
        body: {
          displayName: 'Awesome',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });
});

describe('PATCH /users/{id}', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test("returns 404 when team doesn't exist", async () => {
    nock(config.baseUrl)
      .patch(`/api/content/${config.appName}/users/userId`, {
        displayName: {
          iv: 'Updated Name',
        },
      })
      .reply(404);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'patch',
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'userId',
        },
        body: {
          displayName: 'Updated Name',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(404);
  });

  test('returns 200 when team exists', async () => {
    nock(config.baseUrl)
      .patch(`/api/content/${config.appName}/users/userId`, {
        displayName: {
          iv: 'Updated Name',
        },
      })
      .reply(200, patchResponse);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'patch',
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'userId',
        },
        body: {
          displayName: 'Updated Name',
          firstName: undefined,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(200);
  });
});
