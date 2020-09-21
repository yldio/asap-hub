import Chance from 'chance';
import nock from 'nock';
import { config as authConfig } from '@asap-hub/auth';
import { ResearchOutputCreationRequest } from '@asap-hub/model';
import { APIGatewayProxyResult } from 'aws-lambda';

import { handler } from '../../../src/handlers/research-outputs/create';
import { createRandomUser } from '../../helpers/create-user';
import { apiGatewayEvent } from '../../helpers/events';

const chance = new Chance();

describe('GET /users/{id}/research-outputs', () => {
  let id: string, code: string;

  const output: ResearchOutputCreationRequest = {
    url: chance.url(),
    doi: chance.string(),
    type: chance.pickone(['proposal']),
    title: chance.sentence(),
    text: chance.paragraph(),
    accessLevel: chance.pickone(['private', 'team', 'public']),
    authors: [
      {
        displayName: chance.name(),
      },
    ],
    publishDate: '2020-02-02T12:00:00Z',
  };

  beforeAll(async () => {
    const user = await createRandomUser();
    id = user.id;
    code = user.connections[0].code;
  });

  test('return 401 when Authentication header is not set', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: output,
        pathParameters: {
          id,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('returns 401 when method is not bearer', async () => {
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          Authorization: `Basic ${chance.string()}`,
        },
        pathParameters: {
          id,
        },
        body: output,
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('returns 403 when Auth0 fails to verify token', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(404);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          id,
        },
        body: output,
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test('returns 403 when Auth0 is unavailable', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(500);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          id,
        },
        body: output,
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test("returns 403 when id param is not the user's id", async () => {
    nock(`https://${authConfig.domain}`)
      .get('/userinfo')
      .reply(200, { sub: code });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          id: 'NotTheUser',
        },
        body: output,
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test('returns 400 when body is not set', async () => {
    nock(`https://${authConfig.domain}`)
      .get('/userinfo')
      .reply(200, { sub: code });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          id,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });

  test('returns 400 when body is invalid', async () => {
    nock(`https://${authConfig.domain}`)
      .get('/userinfo')
      .reply(200, { sub: code });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          id,
        },
        body: {
          ...output,
          type: 'invalid',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });

  test('returns 201 when successfully creates Research Output', async () => {
    nock(`https://${authConfig.domain}`)
      .get('/userinfo')
      .reply(200, { sub: code });

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          Authorization: `Bearer ${chance.string()}`,
        },
        pathParameters: {
          id,
        },
        body: output,
      }),
    )) as APIGatewayProxyResult;
    const body = JSON.parse(result.body);

    expect(result.statusCode).toStrictEqual(201);
    expect(body.url).toStrictEqual(output.url);
    expect(body.title).toStrictEqual(output.title);
  });
});
