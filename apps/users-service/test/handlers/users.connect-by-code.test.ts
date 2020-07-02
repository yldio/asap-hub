import Chance from 'chance';
import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config as authConfig } from '@asap-hub/auth';
import { handler } from '../../src/handlers/connect-by-code';
import { apiGatewayEvent } from '../helpers/events';
import { auth0BaseUrl } from '../../src/config';
import { createRandomUser } from '../helpers/create-user';
import { CMS } from '../../src/cms';

jest.mock('@asap-hub/auth');

const chance = new Chance();
const cms = new CMS();

describe('POST /users/connections', () => {
  let id, code;

  const auth0Response = {
    sub: `google-oauth2|${chance.string()}`,
  };

  beforeAll( async () => {
    const user = await createRandomUser()
    id = user.id
    code = user.connections[0].code
  })

  test("returns 400 when token is not defined", async () => {
    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          authorization: `Bearer ${chance.string()}`,
        },
        body: {
          code,
        }
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(400);
  });

  test("returns 400 when code is not defined", async () => {
    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          authorization: `Bearer ${chance.string()}`,
        },
        body: {
          token: chance.string()
        }
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(400);
  });

  test('returns 403 when auth0 return an error', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(404);

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          authorization: `Bearer ${chance.string()}`,
        },
        body: {
          code,
          token: chance.string()
        }
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    const userFound = await cms.users.fetchByCode(code);

    expect(userFound).toBeDefined();
    expect(userFound.data.connections.iv).toHaveLength(1);
    expect(res.statusCode).toStrictEqual(403);
  });

  test('returns 403 for invalid code', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200, auth0Response);

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          authorization: `Bearer ${chance.string()}`,
        },
        body: {
          code: chance.string(),
          token: chance.string()
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
  });

  test('returns 202 for valid code and updates the user', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200, auth0Response);

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          authorization: `Bearer ${chance.string()}`,
        },
        body: {
          code,
          token: chance.string()
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(202);

    const userFound = await cms.users.fetchByCode(code);

    expect(userFound).toBeDefined();
    expect(userFound.data.connections.iv).toHaveLength(2);
    expect(userFound.data.connections.iv[1].code).toStrictEqual(auth0Response.sub);
  });
});
