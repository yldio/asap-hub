import nock from 'nock';
import aws from 'aws-sdk';
import matches from 'lodash.matches';
import { APIGatewayProxyResult } from 'aws-lambda';

import { cms } from '../../../src/config';
import { handler } from '../../../src/handlers/users/create';
import { apiGatewayEvent } from '../../helpers/events';
import { globalToken } from '../../../src/config';
import { identity } from '../../helpers/squidex';
import { CMSUser } from '../../../src/entities';

jest.mock('aws-sdk', () => {
  const m = {
    sendTemplatedEmail: jest.fn(() => ({
      promise: jest.fn(() => Promise.resolve({})),
    })),
  };
  return { SES: jest.fn(() => m) };
});

jest.mock('uuid', () => {
  return { v4: jest.fn(() => 'uuid') };
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
  beforeAll(() => {
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
    const user: CMSUser = {
      id: 'uuid-1',
      lastModified: '2020-09-25T11:06:27.164Z',
      created: '2020-09-24T11:06:27.164Z',
      data: {
        lastModifiedDate: { iv: '2020-09-25T11:06:27.164Z' },
        displayName: { iv: 'Name' },
        email: { iv: 'me@example.com' },
        firstName: { iv: 'First' },
        lastName: { iv: 'Last' },
        jobTitle: { iv: 'Title' },
        institution: { iv: 'Institution' },
        biography: { iv: 'Biography' },
        location: { iv: 'Lisbon, Portugal' },
        connections: { iv: [{ code: 'uuid' }] },
      },
    };

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
