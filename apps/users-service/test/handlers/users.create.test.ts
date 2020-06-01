import Chance from 'chance';
import aws from 'aws-sdk';
import { APIGatewayProxyResult } from 'aws-lambda';
import { handler } from '../../src/handlers/create';
import { apiGatewayEvent } from '../helpers/events';
import connection from '../../src/utils/connection';

jest.mock('aws-sdk', () => {
  const m = {
    sendEmail: jest.fn(() => ({
      promise: jest.fn(() => Promise.resolve({})),
    })),
  };
  return { SES: jest.fn(() => m) };
});

const chance = new Chance();
describe('POST /api/users', () => {
  afterAll(async () => {
    const c = await connection();
    c.close();
  });

  test("returns 400 when body isn't parsable as JSON", async () => {
    const result = (await handler(
      apiGatewayEvent({
        body: 'invalid json',
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });

  test('return 400 when body is empty', async () => {
    const result = (await handler(
      apiGatewayEvent({}),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });

  test('returns 400 when email is a duplicate', async () => {
    const payload = {
      displayName: `${chance.first()} ${chance.last()}`,
      email: chance.email(),
    };

    const c = await connection();
    await c.db().collection('users').insertMany([payload]);

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: payload,
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(400);
  });

  test('returns 201 and sends email with token', async () => {
    const ses = new aws.SES();
    const payload = {
      displayName: `${chance.first()} ${chance.last()}`,
      email: chance.email(),
    };

    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: payload,
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(result.statusCode).toStrictEqual(201);

    const c = await connection();
    const user = await c.db().collection('users').findOne({
      email: payload.email,
    });

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
            Data: `<p>${user.invite.code}</p>`,
          },
          Text: {
            Charset: 'UTF-8',
            Data: `${user.invite.code}`,
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
