import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config } from '@asap-hub/squidex';

import { handler } from '../../../src/handlers/users/update-avatar';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import { body } from './update-avatar.fixtures';
import { patchResponse } from './update.fixtures';
import decodeToken from '../../../src/utils/validate-token';

jest.mock('../../../src/utils/validate-token');

describe('PATCH /users/{id}/avatar - validations', () => {
  test('returns 401 when Authentication header is not set', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'patch',
        pathParameters: {
          id: 'userId',
        },
        body,
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
        body,
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
        body,
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
        body,
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });
});

describe('Update user avatar', () => {
  beforeAll(() => {
    identity();
  });

  afterAll(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('should return 500 when sync asset fails', async () => {
    nock(config.baseUrl).post(`/api/apps/${config.appName}/assets`).reply(500);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'patch',
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'userId',
        },
        body,
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(500);
  });

  test('should return 500 when fails to update user', async () => {
    nock(config.baseUrl)
      .post(`/api/apps/${config.appName}/assets`)
      .reply(200, { id: 'squidex-asset-id' })
      .patch(`/api/content/${config.appName}/users/userId`, {
        avatar: { iv: ['squidex-asset-id'] },
      })
      .reply(500);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'patch',
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'userId',
        },
        body,
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(500);
  });

  test('should return 200 when syncs asset and updates users profile', async () => {
    nock(config.baseUrl)
      .post(`/api/apps/${config.appName}/assets`)
      .reply(200, { id: 'squidex-asset-id' })
      .patch(`/api/content/${config.appName}/users/userId`, {
        avatar: { iv: ['squidex-asset-id'] },
      })
      .reply(200, {
        ...patchResponse,
        data: {
          ...patchResponse.data,
          avatar: {
            iv: ['squidex-asset-id'],
          },
        },
      });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'patch',
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'userId',
        },
        body,
      }),
    )) as APIGatewayProxyResult;

    const resBody = JSON.parse(result.body);
    expect(result.statusCode).toBe(200);

    expect(resBody).toStrictEqual({
      id: 'userId',
      displayName: 'Cristiano Ronaldo',
      createdDate: '2020-09-25T09:42:51.000Z',
      lastModifiedDate: '2020-09-25T09:42:51.132Z',
      email: 'cristiano@ronaldo.com',
      firstName: 'Cristiano',
      lastName: 'Ronaldo',
      jobTitle: 'Junior',
      institution: 'Dollar General Corporation',
      teams: [
        {
          id: 'team-id-1',
          displayName: 'Unknown',
          role: 'Lead PI (Core Leadership)',
        },
      ],
      location: 'Zofilte',
      orcid: '363-98-9330',
      orcidWorks: [],
      skills: [],
      questions: [],
      avatarUrl: `${config.baseUrl}/api/assets/${config.appName}/squidex-asset-id`,
      role: 'Grantee',
    });
  });
});
