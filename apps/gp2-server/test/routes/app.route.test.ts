import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';

describe('App default routes', () => {
  const app = appFactory({
    authHandler: authHandlerMock,
  });

  test('Should return a 404 when the path is not found', async () => {
    const response = await supertest(app).get('/some-invalid-path');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found',
    });
  });
});
