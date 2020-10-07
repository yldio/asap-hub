import nock from 'nock';
import aws from 'aws-sdk';
import matches from 'lodash.matches';
import { APIGatewayProxyResult } from 'aws-lambda';

import { cms } from '../../../src/config';
import { handler } from '../../../src/handlers/users/create';
import { apiGatewayEvent } from '../../helpers/events';
import { globalToken } from '../../../src/config';
import { identity } from '../../helpers/squidex';
import { response } from './fetch.fixtures';

jest.mock('aws-sdk', () => {
  const m = {
    sendTemplatedEmail: jest.fn(() => ({
      promise: jest.fn(() => Promise.resolve({})),
    })),
  };
  return { SES: jest.fn(() => m) };
});

describe('POST /users', () => {
  test("returns 400 when body isn't parsable as JSON", async () => {
    const res = (await handler(
      apiGatewayEvent({
        body: 'invalid json',
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(400);
  });

  test('return 400 when body is empty', async () => {
    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: `Bearer ${globalToken}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });

  test('return 401 when authorization header not present', async () => {
    const result = (await handler(
      apiGatewayEvent({
        body: {
          displayName: 'test user',
          email: 'testuser@asap.science',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('return 403 when authorization header is not bearer', async () => {
    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: `Basic invalid_token`,
        },
        body: {
          displayName: 'test user',
          email: 'testuser@asap.science',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test("return 403 when authorization header isn't valid", async () => {
    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: `Bearer invalid_token`,
        },
        body: {
          displayName: 'test user',
          email: 'testuser@asap.science',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });
});

describe('POST /users', () => {
  beforeEach(() => {
    // TODO: beforeEach because create still uses old cms
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('returns 409 when email is a duplicate', async () => {
    nock(cms.baseUrl)
      .post(
        `/api/content/${cms.appName}/users?publish=true`,
        matches({
          displayName: { iv: 'duplicated' },
          email: { iv: 'testuser@asap.science' },
        }),
      )
      .reply(409);

    const res = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: `Bearer ${globalToken}`,
        },
        httpMethod: 'post',
        body: {
          displayName: 'duplicated',
          email: 'testuser@asap.science',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(409);
  });

  test('returns 201 and sends email with code', async () => {
    const user = response.items[0];
    user.data.connections.iv = [{ code: 'uuid' }];

    nock(cms.baseUrl)
      .post(
        `/api/content/${cms.appName}/users?publish=true`,
        matches({
          displayName: { iv: 'test user' },
          email: { iv: 'testuser@asap.science' },
        }),
      )
      .reply(201, user);

    const res = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: `Bearer ${globalToken}`,
        },
        httpMethod: 'post',
        body: {
          displayName: 'test user',
          email: 'testuser@asap.science',
        },
      }),
    )) as APIGatewayProxyResult;

    const ses = new aws.SES();
    expect(res.statusCode).toStrictEqual(201);
    expect(ses.sendTemplatedEmail).toBeCalledTimes(1);
    expect(ses.sendTemplatedEmail).toBeCalledWith({
      Source: 'no-reply@hub.asap.science',
      Destination: {
        ToAddresses: ['testuser@asap.science'],
      },
      Template: 'Welcome',
      TemplateData: JSON.stringify({
        firstName: 'test user',
        link: `http://localhost:3000/welcome/uuid`,
      }),
    });
  });
});
