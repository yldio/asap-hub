import 'express-async-errors';
import supertest from 'supertest';
import express, { Router } from 'express';
import { createUserResponse, getJwtPayload } from '@asap-hub/fixtures';
import { authHandlerFactory } from '../../src/middleware/auth-handler';
import { errorHandlerFactory } from '../../src/middleware/error-handler';
import { getHttpLogger, Logger } from '../../src/utils/logger';
import { DecodeToken } from '../../src/utils/validate-token';
import { loggerMock } from '../mocks/logger.mock';
import { UserResponse } from '@asap-hub/model';

describe('Authentication middleware', () => {
  const mockRoutes = Router();
  const jwtPayload = getJwtPayload({ origin: 'test' });
  mockRoutes.get('/test-route', (req, res) => {
    return res.json(req['loggedInUser']);
  });
  const decodeToken: jest.MockedFunction<DecodeToken> = jest.fn();
  const fetchByCode: jest.MockedFunction<
    (code: string) => Promise<UserResponse>
  > = jest.fn().mockResolvedValue(createUserResponse());

  const authHandler = authHandlerFactory(decodeToken, fetchByCode, loggerMock);
  const errorHandler = errorHandlerFactory();
  const httpLogger = getHttpLogger({ logger: loggerMock });
  const app = express();
  app.use(httpLogger);
  app.use(authHandler);
  app.use(mockRoutes);
  app.use(errorHandler);

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

  test('Should fetch the logged in user by sub parameter and add them to the req object', async () => {
    decodeToken.mockResolvedValueOnce(jwtPayload);

    const response = await supertest(app)
      .get('/test-route')
      .set('Authorization', 'Bearer something');

    expect(fetchByCode).toBeCalledWith(jwtPayload.sub);
    expect(response.body).toEqual(createUserResponse());
  });
});
