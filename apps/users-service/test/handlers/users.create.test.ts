import Chance from 'chance';
import aws from 'aws-sdk';
import { APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../src/handlers/create';
import { apiGatewayEvent } from '../helpers/events';
import { globalToken } from '../../src/config';
import { CMS } from '../../src/cms';

jest.mock('aws-sdk', () => {
  const m = {
    sendTemplatedEmail: jest.fn(() => ({
      promise: jest.fn(() => Promise.resolve({})),
    })),
  };
  return { SES: jest.fn(() => m) };
});

const chance = new Chance();
const cms = new CMS();

describe('POST /users', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns 400 when body isn't parsable as JSON", async () => {
    const res = (await handler(
      apiGatewayEvent({
        body: 'invalid json',
      }),
      null,
      null,
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
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });

  test('return 401 when authorization header not present', async () => {
    const payload = {
      displayName: `${chance.first()} ${chance.last()}`,
      email: chance.email(),
    };

    const result = (await handler(
      apiGatewayEvent({
        body: payload,
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(401);
  });

  test('return 403 when authorization header is not bearer', async () => {
    const payload = {
      displayName: `${chance.first()} ${chance.last()}`,
      email: chance.email(),
    };

    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: `Basic invalid_token`,
        },
        body: payload,
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test("return 403 when authorization header isn't valid", async () => {
    const payload = {
      displayName: `${chance.first()} ${chance.last()}`,
      email: chance.email(),
    };

    const result = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: `Bearer invalid_token`,
        },
        body: payload,
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(403);
  });

  test('returns 409 when email is a duplicate', async () => {
    const payload = {
      displayName: `${chance.first()} ${chance.last()}`,
      email: chance.email(),
    };

    await cms.users.create(payload);

    const res = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: `Bearer ${globalToken}`,
        },
        httpMethod: 'post',
        body: {
          displayName: payload.displayName,
          email: payload.email,
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(409);
  });

  test('returns 201 and sends email with code', async () => {
    const ses = new aws.SES();
    const payload = {
      displayName: `${chance.first()} ${chance.last()}`,
      email: chance.email(),
    };

    const res = (await handler(
      apiGatewayEvent({
        headers: {
          Authorization: `Bearer ${globalToken}`,
        },
        httpMethod: 'post',
        body: payload,
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(201);

    const user = await cms.users.fetchByEmail(payload.email);
    const [code] = user.connections;
    expect(ses.sendTemplatedEmail).toBeCalledTimes(1);
    expect(ses.sendTemplatedEmail).toBeCalledWith({
      Source: 'no-reply@asap.yld.io',
      Destination: {
        ToAddresses: [payload.email],
      },
      Template: 'Welcome',
      TemplateData: JSON.stringify({
        firstName: payload.displayName,
        link: `http://localhost:3000/welcome/${code}`,
      }),
    });
  });
});
