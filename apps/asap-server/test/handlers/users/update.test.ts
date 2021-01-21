import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config } from '@asap-hub/squidex';

import { handler } from '../../../src/handlers/users/update';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import {
  buildUserGraphqlResponse,
  getUserResponse,
  putResponse,
  expectation,
} from './update.fixtures';
import decodeToken from '../../../src/utils/validate-token';
import { buildGraphQLQueryFetchUser } from '../../../src/controllers/users';

jest.mock('../../../src/utils/validate-token');

describe('PATCH /users/{id} - validations', () => {
  test('returns 401 when Authentication header is not set', async () => {
    const result = (await handler(
      apiGatewayEvent({
        pathParameters: {
          id: 'userId',
        },
        body: JSON.stringify({
          jobTitle: 'CEO',
        }),
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
          id: 'userId',
        },
        body: JSON.stringify({
          jobTitle: 'CEO',
        }),
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
          id: 'userId',
        },
        body: JSON.stringify({
          jobTitle: 'CEO',
        }),
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
          id: 'userId',
        },
      }),
    )) as APIGatewayProxyResult;

    const result2 = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'userId',
        },
        body: JSON.stringify({
          teams: [
            {
              id: 'team-id-3',
            },
          ],
        }),
      }),
    )) as APIGatewayProxyResult;

    expect(result1.statusCode).toStrictEqual(400);
    expect(result2.statusCode).toStrictEqual(400);
  });

  test('returns 403 when user is changing other user', async () => {
    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'not-me',
        },
        body: JSON.stringify({
          jobTitle: 'CEO',
        }),
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test('returns 403 when editing a team he doesnt belong to', async () => {
    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'userId',
        },
        body: JSON.stringify({
          teams: [
            {
              id: 'team-id-1000',
              responsibilities: 'I do stuff',
            },
          ],
        }),
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

  describe('update user props', () => {
    test("returns 404 when team doesn't exist", async () => {
      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/users/userId`, {
          jobTitle: { iv: 'CEO' },
        })
        .reply(404);

      const result = (await handler(
        apiGatewayEvent({
          headers: {
            Authorization: 'Bearer token',
          },
          pathParameters: {
            id: 'userId',
          },
          body: JSON.stringify({
            jobTitle: 'CEO',
          }),
        }),
      )) as APIGatewayProxyResult;

      expect(result.statusCode).toStrictEqual(404);
    });

    test('returns 200 when trying to delete fields', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users/userId`)
        .reply(200, getUserResponse)
        .put(`/api/content/${config.appName}/users/userId`, {
          ...getUserResponse.data,
          contactEmail: { iv: null },
          biography: { iv: 'I do awesome stuff' },
          jobTitle: { iv: null },
          orcid: { iv: null },
          institution: { iv: null },
          degree: { iv: null },
          location: { iv: null },
          skills: { iv: [] },
          skillsDescription: { iv: null },
          questions: { iv: [] },
        } as { [k: string]: any })
        .reply(200, putResponse)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchUser('userId'),
        })
        .reply(
          200,
          buildUserGraphqlResponse({
            contactEmail: null,
            biography: 'I do awesome stuff',
            jobTitle: null,
            orcid: null,
            institution: null,
            degree: null,
            location: null,
            skills: [],
            skillsDescription: null,
            questions: [],
          }),
        );

      const result = (await handler(
        apiGatewayEvent({
          headers: {
            Authorization: 'Bearer token',
          },
          pathParameters: {
            id: 'userId',
          },
          body: JSON.stringify({
            contactEmail: '',
            biography: 'I do awesome stuff',
            jobTitle: '',
            orcid: '',
            institution: '',
            degree: '',
            location: '',
            skills: [],
            skillsDescription: '',
            questions: [],
          }),
        }),
      )) as APIGatewayProxyResult;

      const body = JSON.parse(result.body);
      expect(result.statusCode).toStrictEqual(200);
      // Just ensure props were deleted
      expect(body).toEqual(
        expect.not.objectContaining({
          contactEmail: expect.any(String),
          jobTitle: expect.any(String),
          orcid: expect.any(String),
          institution: expect.any(String),
          degree: expect.any(String),
          location: expect.any(String),
          skillsDescription: expect.any(String),
        }),
      );
    });

    test('returns 200 when user exists', async () => {
      nock(config.baseUrl)
        .patch(`/api/content/${config.appName}/users/userId`, {
          social: { iv: [{ github: 'johnytiago' }] },
          jobTitle: { iv: 'CEO' },
          questions: { iv: [{ question: 'To be or not to be?' }] },
        })
        .reply(200, getUserResponse)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchUser('userId'),
        })
        .reply(
          200,
          buildUserGraphqlResponse({
            social: [{ github: 'johnytiago' }],
            questions: [{ question: 'To be or not to be?' }],
            jobTitle: 'CEO',
          }),
        );

      const result = (await handler(
        apiGatewayEvent({
          headers: {
            Authorization: 'Bearer token',
          },
          pathParameters: {
            id: 'userId',
          },
          body: JSON.stringify({
            social: { github: 'johnytiago' },
            jobTitle: 'CEO',
            questions: ['To be or not to be?'],
            firstName: undefined, // should be ignored
          }),
        }),
      )) as APIGatewayProxyResult;

      const body = JSON.parse(result.body);
      expect(result.statusCode).toStrictEqual(200);
      expect(body).toStrictEqual({
        ...expectation,
        social: { github: 'johnytiago', orcid: '363-98-9330' },
        jobTitle: 'CEO',
        questions: ['To be or not to be?'],
      });
    });
  });

  describe('update user team props', () => {
    test('returns 200 when trying to edit user teams', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users/userId`)
        .reply(200, getUserResponse)
        .put(`/api/content/${config.appName}/users/userId`, {
          ...getUserResponse.data,
          teams: {
            iv: [
              {
                role: 'Lead PI (Core Leadership)',
                id: ['team-id-1'],
                approach: 'Exact',
                responsibilities: 'Make sure coverage is high',
              },
              {
                role: 'Collaborating PI',
                id: ['team-id-3'],
                responsibilities: 'I do stuff',
                approach: 'orthodox',
              },
            ],
          },
        } as { [k: string]: any })
        .reply(200, putResponse)
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchUser('userId'),
        })
        .reply(
          200,
          buildUserGraphqlResponse({
            teams: [
              {
                role: 'Lead PI (Core Leadership)',
                approach: 'Exact',
                responsibilities: 'Make sure coverage is high',
                id: [
                  {
                    id: 'team-id-1',
                    created: '2020-09-23T20:45:22Z',
                    lastModified: '2020-10-26T15:33:18Z',
                    data: null,
                    flatData: {
                      applicationNumber: 'applicationNumber',
                      projectTitle: 'Awesome project',
                      displayName: 'Jackson, M',
                      proposal: [{ id: 'proposal-id-1' }],
                      skills: [],
                      outputs: [],
                    },
                  },
                ],
              },
              {
                role: 'Collaborating PI',
                responsibilities: 'I do stuff',
                approach: 'orthodox',
                id: [
                  {
                    id: 'team-id-3',
                    created: '2020-09-23T20:45:22Z',
                    lastModified: '2020-10-26T15:33:18Z',
                    data: null,
                    flatData: {
                      applicationNumber: 'applicationNumber',
                      projectTitle: 'Another Awesome project',
                      displayName: 'Tarantino, M',
                      proposal: [{ id: 'proposal-id-2' }],
                      skills: [],
                      outputs: [],
                    },
                  },
                ],
              },
            ],
          }),
        );

      const result = (await handler(
        apiGatewayEvent({
          headers: {
            Authorization: 'Bearer token',
          },
          pathParameters: {
            id: 'userId',
          },
          body: JSON.stringify({
            teams: [
              {
                id: 'team-id-3',
                responsibilities: 'I do stuff',
                approach: 'orthodox',
              },
            ],
          }),
        }),
      )) as APIGatewayProxyResult;

      const body = JSON.parse(result.body);
      expect(result.statusCode).toStrictEqual(200);
      expect(body).toStrictEqual({
        ...expectation,
        teams: [
          {
            id: 'team-id-1',
            displayName: 'Jackson, M',
            proposal: 'proposal-id-1',
            role: 'Lead PI (Core Leadership)',
            approach: 'Exact',
            responsibilities: 'Make sure coverage is high',
          },
          {
            displayName: 'Tarantino, M',
            id: 'team-id-3',
            proposal: 'proposal-id-2',
            role: 'Collaborating PI',
            responsibilities: 'I do stuff',
            approach: 'orthodox',
          },
        ],
      });
    });

    test('returns 200 when trying to delete user teams attributes', async () => {
      nock(config.baseUrl)
        .get(`/api/content/${config.appName}/users/userId`)
        .reply(200, getUserResponse)
        .put(`/api/content/${config.appName}/users/userId`, {
          ...getUserResponse.data,
          teams: {
            iv: [
              {
                role: 'Lead PI (Core Leadership)',
                id: ['team-id-1'],
                approach: 'Exact',
                responsibilities: 'Make sure coverage is high',
              },
              {
                role: 'Collaborating PI',
                id: ['team-id-3'],
                responsibilities: null,
                approach: null,
              },
            ],
          },
        } as { [k: string]: any })
        .reply(200, {
          ...putResponse,
          data: {
            ...putResponse.data,
            teams: {
              iv: [
                {
                  role: 'Lead PI (Core Leadership)',
                  id: ['team-id-1'],
                  approach: 'Exact',
                  responsibilities: 'Make sure coverage is high',
                },
                {
                  role: 'Collaborating PI',
                  id: ['team-id-3'],
                  responsibilities: null,
                  approach: null,
                },
              ],
            },
          },
        })
        .post(`/api/content/${config.appName}/graphql`, {
          query: buildGraphQLQueryFetchUser('userId'),
        })
        .reply(
          200,
          buildUserGraphqlResponse({
            teams: [
              {
                role: 'Lead PI (Core Leadership)',
                approach: 'Exact',
                responsibilities: 'Make sure coverage is high',
                id: [
                  {
                    id: 'team-id-1',
                    created: '2020-09-23T20:45:22Z',
                    lastModified: '2020-10-26T15:33:18Z',
                    data: null,
                    flatData: {
                      applicationNumber: 'applicationNumber',
                      projectTitle: 'Awesome project',
                      displayName: 'Jackson, M',
                      proposal: [{ id: 'proposal-id-1' }],
                      skills: [],
                      outputs: [],
                    },
                  },
                ],
              },
              {
                role: 'Collaborating PI',
                responsibilities: null,
                approach: null,
                id: [
                  {
                    id: 'team-id-3',
                    created: '2020-09-23T20:45:22Z',
                    lastModified: '2020-10-26T15:33:18Z',
                    data: null,
                    flatData: {
                      applicationNumber: 'applicationNumber',
                      projectTitle: 'Another Awesome project',
                      displayName: 'Tarantino, M',
                      proposal: [{ id: 'proposal-id-2' }],
                      skills: [],
                      outputs: [],
                    },
                  },
                ],
              },
            ],
          }),
        );

      const result = (await handler(
        apiGatewayEvent({
          headers: {
            Authorization: 'Bearer token',
          },
          pathParameters: {
            id: 'userId',
          },
          body: JSON.stringify({
            teams: [
              {
                id: 'team-id-3',
                responsibilities: '',
                approach: '',
              },
            ],
          }),
        }),
      )) as APIGatewayProxyResult;

      const body = JSON.parse(result.body);
      expect(result.statusCode).toStrictEqual(200);

      expect(body).toStrictEqual({
        ...expectation,
        teams: [
          {
            id: 'team-id-1',
            displayName: 'Jackson, M',
            proposal: 'proposal-id-1',
            role: 'Lead PI (Core Leadership)',
            approach: 'Exact',
            responsibilities: 'Make sure coverage is high',
          },
          {
            displayName: 'Tarantino, M',
            id: 'team-id-3',
            proposal: 'proposal-id-2',
            role: 'Collaborating PI',
          },
        ],
      });
    });
  });
});
