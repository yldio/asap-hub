import Chance from 'chance';
import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { config as authConfig } from '@asap-hub/auth';
import { handler } from '../../src/handlers/welcome';
import { apiGatewayEvent } from '../helpers/events';
import { auth0BaseUrl } from '../../src/config';
import { createRandomUser } from '../helpers/create-user'
import { CMS } from '../../src/cms';

jest.mock('@asap-hub/auth');

const chance = new Chance();
const cms = new CMS();

describe('POST /users?code={code}', () => {
  test("returns 403 when code doesn't exist", async () => {
    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          authorization: `Bearer ${chance.string()}`,
        },
        queryStringParameters: {
          code: chance.string(),
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
  });

  test('returns 403 when auth0 return an error', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(404);

    const { connections: [{code}] } = await createRandomUser();

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          authorization: `Bearer ${chance.string()}`,
        },
        queryStringParameters: {
          code,
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);

    const userFound = await cms.users.fetchByCode(code);

    expect(userFound).toBeDefined();
    expect(userFound.data.connections.iv).toHaveLength(1);
  });

  test('returns 403 for invalid code', async () => {
    const response = {
      sub: `google-oauth2|${chance.string()}`,
    };
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200, response);

    await createRandomUser();

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          authorization: `Bearer ${chance.string()}`,
        },
        queryStringParameters: {
          code: chance.string(),
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
  });

  test('returns 202 for valid code and updates the user', async () => {
    const response = {
      sub: `google-oauth2|${chance.string()}`,
    };
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200, response);

    const { connections: [{code}] } = await createRandomUser();

    const res = (await handler(
      apiGatewayEvent({
        httpMethod: 'post',
        headers: {
          authorization: `Bearer ${chance.string()}`,
        },
        queryStringParameters: {
          code,
        },
      }),
      null,
      null,
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(202);

    const userFound = await cms.users.fetchByCode(code);

    expect(userFound).toBeDefined();
    expect(userFound.data.connections.iv).toHaveLength(2);
    expect(userFound.data.connections.iv[1].code).toStrictEqual(response.sub);
  });
});
