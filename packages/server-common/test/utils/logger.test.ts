import { createUserResponse } from '@asap-hub/fixtures';
import { UserResponse } from '@asap-hub/model';
import {
  errorHandlerFactory,
  getHttpLogger,
  pino,
} from '@asap-hub/server-common';
import express, { RequestHandler, Router } from 'express';
import supertest from 'supertest';

describe('Http Logger', () => {
  const mockUser = createUserResponse();
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
  );

  const router = Router();
  router.get('/error', async (req, res, next) => {
    next(new Error('error message'));
  });
  router.get('/success', async (req, res) => {
    res.send('foo');
  });
  const httpLogger = getHttpLogger({ logger });
  const app = express();
  app.use([authHandlerMock, httpLogger, router, errorHandlerFactory()]);

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should log every request with request details and logged in user id', async () => {
    getUser.mockReturnValueOnce(mockUser);
    const response = await supertest(app).get('/success');
    expect(response.text).toEqual('foo');
    const firstLogCall = JSON.parse(captureLogs.mock.calls[0][0]);
    expect(firstLogCall).toMatchObject({
      userId: mockUser.id,
      req: {
        url: '/success',
      },
    });
  });

  test('Should not log user ID when the user is not logged in', async () => {
    getUser.mockReturnValueOnce(undefined);

    const response = await supertest(app).get('/success');
    expect(response.text).toEqual('foo');

    const firstLogCall = JSON.parse(captureLogs.mock.calls[0][0]);
    expect(firstLogCall.userId).not.toBeDefined();
  });

  test('Should add user ID to the error message', async () => {
    getUser.mockReturnValueOnce(mockUser);

    await supertest(app).get('/error');

    const firstLogCall = JSON.parse(captureLogs.mock.calls[0][0]);
    expect(firstLogCall).toMatchObject({
      userId: mockUser.id,
      req: {
        url: '/error',
      },
    });
  });
});
