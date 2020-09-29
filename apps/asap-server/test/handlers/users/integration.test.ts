import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { Squidex } from '@asap-hub/services-common';
import { config as authConfig } from '@asap-hub/auth';
import { UserResponse } from '@asap-hub/model';

import { CMSUser } from '../../../src/entities';
import { handler } from '../../../src/handlers/users/fetch-by-id';
import { apiGatewayEvent } from '../../helpers/events';
import { createRandomUser } from '../../helpers/create-user';

const users = new Squidex<CMSUser>('users');
describe('GET /users/{id}', () => {
  let user: UserResponse;
  afterEach(() => nock.cleanAll());

  beforeAll(async () => {
    const { connections, ...res } = await createRandomUser();
    user = res;
  });

  test('returns 200 when users exist', async () => {
    nock(`https://${authConfig.domain}`).get('/userinfo').reply(200);
    const result = (await handler(
      apiGatewayEvent({
        httpMethod: 'get',
        pathParameters: {
          id: user.id,
        },
        headers: {
          Authorization: `Bearer token`,
        },
      }),
    )) as APIGatewayProxyResult;

    const body = JSON.parse(result.body);
    expect(body).toStrictEqual(user);
  });

  afterAll(async () => {
    if (user) {
      await users.delete(user.id);
    }
    nock.cleanAll();
  });
});
