import { Router } from 'express';
import { appFactory } from '../../src/app';
import supertest from 'supertest';
import { authHandlerFactory } from '../../src/middleware/auth-handler';
import { auth0UserMock } from '../../src/utils/__mocks__/validate-token';
import { DecodeToken } from '../../src/utils/validate-token';

describe('Authentication middleware', () => {
  const mockRoutes = Router();
  mockRoutes.get('/test-route', async (_req, res) => {
    return res.json('ok');
  });
  const decodeToken: jest.MockedFunction<DecodeToken> = jest.fn();
  const authHandler = authHandlerFactory(decodeToken);
  const app = appFactory({
    mockRequestHandlers: [mockRoutes],
    authHandler,
  });

  afterEach(() => {
    decodeToken.mockReset();
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

  test('Should return 200 when token is valid', async () => {
    decodeToken.mockResolvedValueOnce(auth0UserMock);

    const response = await supertest(app)
      .get('/test-route')
      .set('Authorization', 'Bearer something');

    expect(response.status).toBe(200);
  });
});
