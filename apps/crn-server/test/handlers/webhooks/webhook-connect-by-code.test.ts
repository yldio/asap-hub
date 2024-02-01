import { APIGatewayProxyResult } from 'aws-lambda';
import { auth0SharedSecret as secret } from '../../../src/config';
import UserController from '../../../src/controllers/user.controller';
import {
  connectByCodeHandler,
  unloggedHandler,
} from '../../../src/handlers/webhooks/webhook-connect-by-code';
import { fetchUserResponseDataObject } from '../../fixtures/users.fixtures';
import {
  getDataProviderMock,
  getDataProviderMock as mockGetDataProvider,
} from '../../mocks/data-provider.mock';

import { getApiGatewayEvent } from '../../helpers/events';

jest.mock('../../../src/utils/logger');

describe('POST /webhook/users/connections - validations', () => {
  test('returns 400 when code is not defined', async () => {
    const res = (await unloggedHandler(
      getApiGatewayEvent({
        body: JSON.stringify({
          userId: 'userId',
        }),
        headers: {
          Authorization: `Basic ${secret}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(400);
  });

  test('returns 400 when userId is not defined', async () => {
    const res = (await unloggedHandler(
      getApiGatewayEvent({
        body: JSON.stringify({
          code: 'asap|token',
        }),
        headers: {
          Authorization: `Basic ${secret}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(400);
  });

  test('returns 400 when additional fields exist', async () => {
    const res = (await unloggedHandler(
      getApiGatewayEvent({
        body: JSON.stringify({
          code: 'asap|token',
          userId: 'userId',
          additionalField: 'some-field',
        }),
        headers: {
          Authorization: `Basic ${secret}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(400);
  });

  test('returns 403 when secret doesnt match', async () => {
    const res = (await unloggedHandler(
      getApiGatewayEvent({
        body: JSON.stringify({
          code: 'asap|token',
          userId: 'userId',
        }),
        headers: {
          Authorization: 'Basic token',
        },
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(403);
  });
});

describe('POST /webhook/users/connections - success', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test('returns 202 for valid code and updates the user', async () => {
    const mockDataProvider = getDataProviderMock();
    const handler = connectByCodeHandler(
      new UserController(
        mockDataProvider,
        getDataProviderMock(),
        getDataProviderMock(),
      ),
    );
    const user = {
      ...fetchUserResponseDataObject(),
      id: 'user-0',
      email: 'test@example.com',
      conections: [],
    };
    mockDataProvider.fetch.mockResolvedValueOnce({
      total: 1,
      items: [user],
    });
    mockDataProvider.fetchById.mockResolvedValue(user);

    const res = (await handler(
      getApiGatewayEvent({
        body: JSON.stringify({
          code: 'asapWelcomeCode',
          userId: 'oauth-connection-code',
        }),
        headers: {
          Authorization: `Basic ${secret}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toEqual(202);
    expect(mockDataProvider.update).toHaveBeenCalledWith(
      'user-0',
      {
        connections: [{ code: 'oauth-connection-code' }],
        email: 'test@example.com',
      },
      { suppressConflict: false },
    );
  });

  test('returns 500 for invalid code', async () => {
    const mockDataProvider = mockGetDataProvider();
    const handler = connectByCodeHandler(
      new UserController(
        mockDataProvider,
        getDataProviderMock(),
        getDataProviderMock(),
      ),
    );
    mockDataProvider.fetch.mockRejectedValue(new Error('some error'));

    const res = (await handler(
      getApiGatewayEvent({
        body: JSON.stringify({
          code: 'invalidConnectCode',
          userId: 'userId',
        }),
        headers: {
          Authorization: `Basic ${secret}`,
        },
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(500);
  });
});
