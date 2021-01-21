import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { Squidex } from '@asap-hub/squidex';
import { UserResponse } from '@asap-hub/model';

import { RestUser } from '@asap-hub/squidex';
import { handler } from '../../../src/handlers/users/fetch-by-id';
import { apiGatewayEvent } from '../../helpers/events';
import { createRandomUser } from '../../helpers/users';

jest.mock('../../../src/utils/validate-token');

const users = new Squidex<RestUser>('users');
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
    const {
      avatarUrl,
      biography,
      degree,
      orcidLastModifiedDate,
      ...rest
    } = body;
    expect({
      ...rest,
      orcidWorks: [],
      avatarUrl: avatarUrl || undefined,
      biography: biography || undefined,
      degree: degree || undefined,
      orcidLastModifiedDate: orcidLastModifiedDate || undefined,
    }).toMatchObject(user);
  });
});
