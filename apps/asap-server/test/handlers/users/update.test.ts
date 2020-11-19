import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config } from '@asap-hub/squidex';

import { handler } from '../../../src/handlers/users/update';
import { apiGatewayEvent } from '../../helpers/events';
import { identity } from '../../helpers/squidex';
import { patchResponse, putResponse, expectation } from './update.fixtures';
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
          jobTitle: 'CEO',
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
          jobTitle: 'CEO',
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
          jobTitle: 'CEO',
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

    const result2 = (await handler(
      apiGatewayEvent({
        httpMethod: 'patch',
        headers: {
          Authorization: 'Bearer token',
        },
        pathParameters: {
          id: 'userId',
        },
        body: {
          teams: [
            {
              id: 'team-id-3',
            },
          ],
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result1.statusCode).toStrictEqual(400);
    expect(result2.statusCode).toStrictEqual(400);
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
          jobTitle: 'CEO',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test('returns 403 when editing a team he doesnt belong to', async () => {
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
          teams: [
            {
              id: 'team-id-1000',
              responsibilities: 'I do stuff',
            },
          ],
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
        jobTitle: { iv: 'CEO' },
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
          jobTitle: 'CEO',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(404);
  });

  test('returns 200 when trying to delete fields', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/users/userId`)
      .reply(200, patchResponse)
      .put(`/api/content/${config.appName}/users/userId`, {
        ...patchResponse.data,
        biography: { iv: 'I do awesome stuff' },
        jobTitle: { iv: null },
        orcid: { iv: null },
        department: { iv: 'Awesome Department' },
        institution: { iv: null },
        degree: { iv: null },
        location: { iv: null },
        skills: { iv: [] },
        skillsDescription: { iv: null },
        questions: { iv: [{ question: 'test' }] },
      } as { [k: string]: any })
      .reply(200, putResponse);

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
          contactEmail: '',
          biography: 'I do awesome stuff',
          jobTitle: '',
          orcid: '',
          department: 'Awesome Department',
          institution: '',
          degree: '',
          location: '',
          skills: [],
          skillsDescription: '',
          questions: [{ question: 'test' }],
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(expectation);
  });

  test('returns 200 when trying to edit user teams', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/users/userId`)
      .reply(200, patchResponse)
      .put(`/api/content/${config.appName}/users/userId`, {
        ...patchResponse.data,
        biography: { iv: 'I do awesome stuff' },
        department: { iv: 'Awesome Department' },
        questions: { iv: [{ question: 'test' }] },
        teams: {
          iv: [
            { role: 'Lead PI (Core Leadership)', id: ['team-id-1'] },
            {
              role: 'Collaborating PI',
              id: ['team-id-3'],
              responsibilities: 'I do stuff',
              approach: 'orthodox',
            },
          ],
        },
      } as { [k: string]: any })
      .reply(200, putResponse);

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
          biography: 'I do awesome stuff',
          department: 'Awesome Department',
          questions: [{ question: 'test' }],
          teams: [
            {
              id: 'team-id-3',
              responsibilities: 'I do stuff',
              approach: 'orthodox',
            },
          ],
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(expectation);
  });

  test('returns 200 when trying to delete user teams', async () => {
    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/users/userId`)
      .reply(200, patchResponse)
      .put(`/api/content/${config.appName}/users/userId`, {
        ...patchResponse.data,
        teams: {
          iv: [
            { role: 'Lead PI (Core Leadership)', id: ['team-id-1'] },
            {
              role: 'Collaborating PI',
              id: ['team-id-3'],
              responsibilities: null,
              approach: null,
            },
          ],
        },
      } as { [k: string]: any })
      .reply(200, putResponse);

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
          teams: [
            {
              id: 'team-id-3',
              responsibilities: '',
              approach: '',
            },
          ],
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(result.statusCode).toStrictEqual(200);
    expect(body).toStrictEqual(expectation);
  });

  test('returns 200 when user exists', async () => {
    nock(config.baseUrl)
      .patch(`/api/content/${config.appName}/users/userId`, {
        jobTitle: { iv: 'CEO' },
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
          jobTitle: 'CEO',
          firstName: undefined,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(200);
  });
});
