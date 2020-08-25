import Chance from 'chance';
import { APIGatewayProxyResult } from 'aws-lambda';

import { handler } from '../../../src/handlers/users/webhook-connect-by-code';
import { apiGatewayEvent } from '../../helpers/events';
import { createRandomUser } from '../../helpers/create-user';
import { CMS } from '../../../src/cms';
import { auth0SharedSecret as secret } from '../../../src/config';

const chance = new Chance();
const cms = new CMS();

describe('POST /webhook/users/connections', () => {
  let code: string;

  beforeAll(async () => {
    const user = await createRandomUser();
    code = user.connections[0].code;
  });

  test('returns 400 when code is not defined', async () => {
    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: {
          userId: chance.string(),
        },
        headers: {
          Authorization: `Basic ${secret}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(400);
  });

  test('returns 403 when secret doesnt match', async () => {
    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: {
          code,
          userId: chance.string(),
        },
        headers: {
          Authorization: `Basic ${chance.string()}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
  });

  test('returns 403 for invalid code', async () => {
    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: {
          code: chance.string(),
          userId: chance.string(),
        },
        headers: {
          Authorization: `Basic ${secret}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
  });

  test('returns 202 for valid code and updates the user', async () => {
    const userId = `google-oauth2|${chance.string()}`;

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        body: {
          code,
          userId,
        },
        headers: {
          Authorization: `Basic ${secret}`,
        },
      }),
    )) as APIGatewayProxyResult;

    const userFound = await cms.users.fetchByCode(code);

    expect(res.statusCode).toStrictEqual(202);
    expect(userFound).not.toBe(null);
    expect(userFound!.data.connections.iv).toHaveLength(2);
    expect(userFound!.data.connections.iv).toContainEqual({ code: userId });
  });
});
