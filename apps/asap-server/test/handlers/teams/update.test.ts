import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config } from '@asap-hub/squidex';

import { handler } from '../../../src/handlers/teams/update';
import { buildGraphQLQueryFetchTeam } from '../../../src/controllers/teams';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import decodeToken from '../../../src/utils/validate-token';
import {
  getUpdateTeamResponse,
  updateResponseTeam,
  getGraphQlTeamResponse,
  updateExpectation,
} from '../../fixtures/teams.fixtures';

jest.mock('../../../src/utils/validate-token');

describe('PATCH /teams/{id} - validations', () => {
  test('returns 401 when Authentication header is not set', async () => {
    const result = (await handler(
      apiGatewayEvent({
        pathParameters: {
          id: 'teamId',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('returns 401 when method is not bearer', async () => {
    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: 'Basic token',
        },
        pathParameters: {
          id: 'teamId',
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
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'teamId',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('returns 401 when token is from a different origin', async () => {
    const mockDecodeToken = decodeToken as jest.MockedFunction<
      typeof decodeToken
    >;

    mockDecodeToken.mockResolvedValueOnce({
      [`some-other-origin/user`]: {
        id: 'userId',
        displayName: 'JT',
        email: 'joao.tiago@asap.science',
        firstName: 'Joao',
        lastName: 'Tiago',
        teams: [
          {
            id: 'team-id-1',
            displayName: 'Awesome Team',
            role: 'Project Manager',
          },
          {
            id: 'team-id-3',
            displayName: 'Zac Torres',
            role: 'Collaborating PI',
          },
        ],
      },
      given_name: 'Joao',
      family_name: 'Tiago',
      nickname: 'joao.tiago',
      name: 'Joao Tiago',
      picture: 'https://lh3.googleusercontent.com/awesomePic',
      locale: 'en',
      updated_at: '2020-10-27T17:55:23.418Z',
      email: 'joao.tiago@asap.science',
      iss: 'https://asap-hub.us.auth0.com/',
      sub: 'google-oauth2|awesomeGoogleCode',
      aud: 'audience',
      nonce: 'onlyOnce',
    });

    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'teamId',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('returns 400 when payload is invalid', async () => {
    const result1 = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'teamId',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result1.statusCode).toStrictEqual(400);

    const result2 = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'teamId',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result2.statusCode).toStrictEqual(400);
  });

  test('returns 403 when user is not part of the the team', async () => {
    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'not-my-team',
        },
        body: JSON.stringify({
          tools: [],
        }),
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
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'team-id-1',
        },
        body: JSON.stringify({
          tools: [],
        }),
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(404);
  });

  test('returns 200 when team exists - removes', async () => {
    nock(config.baseUrl)
      .patch(`/api/content/${config.appName}/teams/team-id-1`, {
        tools: { iv: [] },
      })
      .reply(200, getUpdateTeamResponse()) // response is not used
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchTeam('team-id-1'),
      })
      .reply(200, getGraphQlTeamResponse())
      .get(`/api/content/${config.appName}/users`)
      .query({
        $filter: "data/teams/iv/id eq 'team-id-1'",
      })
      .reply(200, updateResponseTeam);

    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'team-id-1',
        },
        body: JSON.stringify({
          tools: [],
        }),
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(updateExpectation);
  });

  test('returns 200 when team exists - deletes field', async () => {
    const tools = [
      {
        url: 'https://example.com',
        name: 'good link',
      },
    ];

    nock(config.baseUrl)
      .patch(`/api/content/${config.appName}/teams/team-id-1`, {
        tools: { iv: tools },
      })
      .reply(200, getUpdateTeamResponse(tools)) // response is not used
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchTeam('team-id-1'),
      })
      .reply(200, getGraphQlTeamResponse(tools))
      .get(`/api/content/${config.appName}/users`)
      .query({
        $filter: "data/teams/iv/id eq 'team-id-1'",
      })
      .reply(200, updateResponseTeam);

    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'team-id-1',
        },
        body: JSON.stringify({
          tools: [
            {
              url: 'https://example.com',
              name: 'good link',
              description: '',
            },
          ],
        }),
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual({ ...updateExpectation, tools });
  });

  test('returns 200 when team exists - updates', async () => {
    const tools = [
      {
        url: 'https://example.com',
        name: 'good link',
      },
    ];

    nock(config.baseUrl)
      .patch(`/api/content/${config.appName}/teams/team-id-1`, {
        tools: { iv: tools },
      })
      .reply(200, getUpdateTeamResponse(tools)) // response is not used
      .post(`/api/content/${config.appName}/graphql`, {
        query: buildGraphQLQueryFetchTeam('team-id-1'),
      })
      .reply(200, getGraphQlTeamResponse(tools))
      .get(`/api/content/${config.appName}/users`)
      .query({
        $filter: "data/teams/iv/id eq 'team-id-1'",
      })
      .reply(200, updateResponseTeam);

    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'team-id-1',
        },
        body: JSON.stringify({ tools }),
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual({ ...updateExpectation, tools });
  });
});
