import { createUserResponse, getJwtPayload } from '@asap-hub/fixtures';
import { UserResponse } from '@asap-hub/model';
import express, { Express, Request, RequestHandler, Router } from 'express';
import 'express-async-errors';
import supertest from 'supertest';
import { MemoryCacheClient } from '../../src/clients/cache.client';
import { authHandlerFactory } from '../../src/middleware/auth-handler';
import { errorHandlerFactory } from '../../src/middleware/error-handler';
import { getHttpLogger } from '../../src/utils/logger';
import { DecodeToken } from '../../src/utils/validate-token';
import { loggerMock } from '../mocks/logger.mock';

describe('Authentication middleware', () => {
  const mockRoutes = Router();
  const jwtPayload = getJwtPayload();
  mockRoutes.get('/test-route', (req, res) => {
    return res.json(req['loggedInUser']);
  });
  const decodeToken: jest.MockedFunction<DecodeToken> = jest.fn();
  const fetchByCode: jest.MockedFunction<
    (code: string) => Promise<UserResponse>
  > = jest.fn().mockResolvedValue(createUserResponse());

  let app: Express;
  let authHandler: RequestHandler;

  const httpLogger = getHttpLogger({ logger: loggerMock });
  const errorHandler = errorHandlerFactory();
  const assignUserToContext = jest.fn();

  let request: Request;
  beforeEach(() => {
    const cacheClient = new MemoryCacheClient<UserResponse>();
    authHandler = authHandlerFactory(
      decodeToken,
      fetchByCode,
      cacheClient,
      loggerMock,
      assignUserToContext,
    );
    app = express();
    app.use(httpLogger);
    app.use((req, _res, next) => {
      request = req;
      next();
    });
    app.use(authHandler);
    app.use(mockRoutes);
    app.use(errorHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should return 401 when Authorization header is not set', async () => {
    const response = await supertest(app).get('/test-route');

    expect(response.status).toBe(401);
  });

  test('Should return 401 when method is not bearer', async () => {
    const response = await supertest(app)
      .get('/test-route')
      .set('Authorization', 'Basic token');

    expect(response.status).toBe(401);
  });

  test('Should return 401 when token is invalid', async () => {
    decodeToken.mockRejectedValueOnce(new Error());

    const response = await supertest(app)
      .get('/test-route')
      .set('Authorization', 'Bearer something');

    expect(response.status).toBe(401);
  });

  test('Should return 401 when token does not have the sub property', async () => {
    const jwtPayloadNoSub = getJwtPayload();
    jwtPayloadNoSub.sub = undefined;
    decodeToken.mockResolvedValueOnce(jwtPayloadNoSub);

    const response = await supertest(app)
      .get('/test-route')
      .set('Authorization', 'Bearer something');

    expect(response.status).toBe(401);
  });

  test('Should return 401 when it is unable to fetch the user', async () => {
    decodeToken.mockResolvedValueOnce(jwtPayload);
    fetchByCode.mockRejectedValueOnce(new Error('some error'));

    const response = await supertest(app)
      .get('/test-route')
      .set('Authorization', 'Bearer something');

    expect(response.status).toBe(401);
  });

  test('Should return 200 when token is valid', async () => {
    decodeToken.mockResolvedValueOnce(jwtPayload);

    const response = await supertest(app)
      .get('/test-route')
      .set('Authorization', 'Bearer something');

    expect(response.status).toBe(200);
  });

  test('Should cache user-response and only call the endpoint once', async () => {
    decodeToken.mockResolvedValue(jwtPayload);

    const response1 = await supertest(app)
      .get('/test-route')
      .set('Authorization', 'Bearer something');
    const response2 = await supertest(app)
      .get('/test-route')
      .set('Authorization', 'Bearer something');

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    expect(fetchByCode).toBeCalledTimes(1);
  });

  test('Should not cache the user data for the same user if they use a different token', async () => {
    decodeToken.mockResolvedValue(jwtPayload);

    const response1 = await supertest(app)
      .get('/test-route')
      .set('Authorization', 'Bearer something');
    const response2 = await supertest(app)
      .get('/test-route')
      .set('Authorization', 'Bearer something-else');

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    expect(fetchByCode).toBeCalledTimes(2);
  });

  test('Should fetch the logged in user by sub parameter and call the callback with the user', async () => {
    decodeToken.mockResolvedValueOnce(jwtPayload);

    await supertest(app)
      .get('/test-route')
      .set('Authorization', 'Bearer something');

    expect(fetchByCode).toBeCalledWith(jwtPayload.sub);
    expect(assignUserToContext).toBeCalledWith(request, createUserResponse());
  });
});
