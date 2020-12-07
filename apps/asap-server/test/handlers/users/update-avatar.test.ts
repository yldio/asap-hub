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

describe('POST /users/{id}/avatar - validations', () => {
  test('returns 401 when Authentication header is not set', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
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
        httpMethod: 'post',
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
        httpMethod: 'post',
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
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'userId',
        },
        body: {},
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });
  test('returns 400 when payload is not data URL conformant', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'userId',
        },
        body: {
          avatar: 'data:video/mp4',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });

  test('returns 415 when content type is invalid', async () => {
    const result1 = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'userId',
        },
        body: {
          avatar: 'data:video/mp4;base64,some-data',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result1.statusCode).toStrictEqual(415);
  });

  test('returns 413 when avatar is too big', async () => {
    const result1 = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'userId',
        },
        body: {
          avatar: `data:image/jpeg;base64,${Buffer.alloc(4e6).toString(
            'base64',
          )}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result1.statusCode).toStrictEqual(413);
  });

  test('returns 403 when user is changing other user', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
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
        httpMethod: 'post',
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

  test('should return detailed error when squidex returns 400', async () => {
    nock(config.baseUrl)
      .post(`/api/apps/${config.appName}/assets`)
      .reply(400, {
        message: 'wrong file type',
        details: ['must be an image'],
      });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'userId',
        },
        body,
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual(expect.stringContaining('Squidex Error'));
    expect(result.body).toEqual(expect.stringContaining('details'));
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
        httpMethod: 'post',
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
        httpMethod: 'post',
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
          approach: 'Exact',
          responsibilities: 'Make sure coverage is high',
        },
        {
          id: 'team-id-3',
          displayName: 'Unknown',
          role: 'Collaborating PI',
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
