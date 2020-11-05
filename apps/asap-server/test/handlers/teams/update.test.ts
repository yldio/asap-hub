import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config } from '@asap-hub/squidex';

import { handler } from '../../../src/handlers/teams/update';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import { teamsResponse } from './fetch.fixtures';
import decodeToken from '../../../src/utils/validate-token';

jest.mock('../../../src/utils/validate-token');

describe('PATCH /teams/{id} - validations', () => {
  test('returns 401 when Authentication header is not set', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'patch',
        pathParameters: {
          id: 'teamId',
        },
        body: {
          tools: [],
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
          id: 'teamId',
        },
        body: {
          tools: [],
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
          id: 'teamId',
        },
        body: {
          tools: [],
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
          id: 'teamId',
        },
        body: { tools: [{ url: 'just url' }] },
      }),
    )) as APIGatewayProxyResult;

    expect(result1.statusCode).toStrictEqual(400);

    const result2 = (await handler(
      apiGatewayEvent({
        httpMethod: 'patch',
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'teamId',
        },
        body: {},
      }),
    )) as APIGatewayProxyResult;

    expect(result2.statusCode).toStrictEqual(400);
  });

  test('returns 403 when user is not part of the the team', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'patch',
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'not-my-team',
        },
        body: {
          tools: [],
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });
});

describe('PATCH /teams/{id}', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test("returns 404 when team doesn't exist", async () => {
    nock(config.baseUrl)
      .patch(`/api/content/${config.appName}/teams/team-id-1`)
      .reply(404);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'patch',
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'team-id-1',
        },
        body: {
          tools: [],
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(404);
  });

  test('returns 200 when team exists', async () => {
    nock(config.baseUrl)
      .patch(`/api/content/${config.appName}/teams/team-id-1`)
      .reply(200, teamsResponse.items[0]);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'patch',
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'team-id-1',
        },
        body: {
          tools: [],
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        displayName: expect.any(String),
        applicationNumber: expect.any(String),
        projectTitle: expect.any(String),
        projectSummary: expect.any(String),
        skills: expect.anything(),
        tools: expect.anything(),
        members: expect.anything(),
      }),
    );
  });
});
