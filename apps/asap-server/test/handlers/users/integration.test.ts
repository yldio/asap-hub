import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { Squidex } from '@asap-hub/services-common';
import { UserResponse } from '@asap-hub/model';

import { CMSUser } from '../../../src/entities/user';
import { handler } from '../../../src/handlers/users/fetch-by-id';
import { apiGatewayEvent } from '../../helpers/events';
import { createRandomUser } from '../../helpers/users';

jest.mock('../../../src/utils/validate-token');

const users = new Squidex<CMSUser>('users');
describe('GET /users/{id}', () => {
  let user: UserResponse;

  beforeAll(async () => {
    const { connections, ...res } = await createRandomUser();
    user = res;
  });

  afterEach(() => {
    nock.cleanAll();
  });

  afterAll(async () => {
    expect(nock.isDone()).toBe(true);
    if (user) {
      await users.delete(user.id);
    }
  });

  test('returns 200 when users exist', async () => {
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
    expect(result.statusCode).toStrictEqual(200);
    expect(body).toMatchObject(user);
  });
});
