import { createUserResponse } from '@asap-hub/fixtures';
import { UserResponse } from '@asap-hub/model';
import { Logger, pino } from '@asap-hub/server-common';
import { RequestHandler, Router } from 'express';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { sentryTransactionIdHandlerMock } from '../mocks/sentry-transaction-id-handler.mock';

describe('User info logging handler', () => {
  const mockUser = createUserResponse();
  // mock auth handler
  const getUser: jest.MockedFunction<() => UserResponse | undefined> =
    jest.fn();
  const authHandlerMock: RequestHandler = async (req, _res, next) => {
    req.loggedInUser = getUser();
    next();
  };

  // logger instance with an extra write stream
  // only for testing purposes
  const captureLogs = jest.fn();
  const logger = pino(
    {},
    {
      write: captureLogs,
    },
  ) as Logger;

  // mock test routes
  const logRoutes = Router();
  logRoutes.get('/events/error-route', async () => {
    throw new Error('error message');
  });
  logRoutes.get('/events/custom-log', async (req, res) => {
    res.send('foo');
  });

  const app = appFactory({
    mockRequestHandlers: [logRoutes],
    authHandler: authHandlerMock,
    sentryTransactionIdHandler: sentryTransactionIdHandlerMock,
    logger,
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Should log user ID when the user is logged in', async () => {
    getUser.mockReturnValueOnce(mockUser);

    await supertest(app).get('/events/custom-log');

    const firstLogCall = JSON.parse(captureLogs.mock.calls[0][0]);
    expect(firstLogCall).toMatchObject({ userId: mockUser.id });
  });

  test('Should not log user ID when the user is not logged in', async () => {
    getUser.mockReturnValueOnce(undefined);

    await supertest(app).get('/events/custom-log');

    const firstLogCall = JSON.parse(captureLogs.mock.calls[0][0]);
    expect(firstLogCall.userId).not.toBeDefined();
  });

  test('Should add user ID to the error message', async () => {
    getUser.mockReturnValueOnce(mockUser);

    await supertest(app).get('/events/error-route');

    const firstLogCall = JSON.parse(captureLogs.mock.calls[0][0]);
    expect(firstLogCall).toMatchObject({ userId: mockUser.id });
  });
});
