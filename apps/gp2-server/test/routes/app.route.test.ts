import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';

jest.mock('@asap-hub/server-common', () => ({
  ...jest.requireActual('@asap-hub/server-common'),
  assignUserToContext: jest.fn(),
}));
describe('App default routes', () => {
  test('Should return a 404 when the path is not found', async () => {
    const appNoAuth = appFactory({
      authHandler: authHandlerMock,
      logger: loggerMock,
    });

    const response = await supertest(appNoAuth).get('/some-invalid-path');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found',
    });
  });

  test('Should return a 401 when the auth header is not present', async () => {
    const app = appFactory({
      logger: loggerMock,
    });

    const response = await supertest(app).get('/dashboard');

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
    });
  });
});
