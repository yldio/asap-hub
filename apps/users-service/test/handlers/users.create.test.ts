import Chance from 'chance';
import aws from 'aws-sdk';
import { APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../src/handlers/create';
import { apiGatewayEvent } from '../helpers/events';
import connection from '../../src/utils/connection';
import { globalToken } from '../../src/config';

jest.mock('aws-sdk', () => {
  const m = {
    sendEmail: jest.fn(() => ({
      promise: jest.fn(() => Promise.resolve({})),
    })),
  };
  return { SES: jest.fn(() => m) };
});

const chance = new Chance();
describe('POST /users', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    const c = await connection();
    c.close();
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
      connections: [chance.string()],
    };

    const c = await connection();
    await c.db().collection('users').insertMany([payload]);

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

    const c = await connection();
    const user = await c.db().collection('users').findOne({
      email: payload.email,
    });

    const [code] = user.connections;
    expect(ses.sendEmail).toBeCalledTimes(1);
    expect(ses.sendEmail).toBeCalledWith({
      Source: 'no-reply@asap.yld.io',
      Destination: {
        ToAddresses: [payload.email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<div><p>Hey, ${payload.displayName}</p><a href=\"http://localhost:3000/welcome/${code}\">http://localhost:3000/welcome/${code}</a></div>`,
          },
          Text: {
            Charset: 'UTF-8',
            Data: `Hey, ${payload.displayName}\n\nhttp://localhost:3000/welcome/${code}`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Welcome',
        },
      },
    });
  });
});
