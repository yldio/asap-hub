import supertest from 'supertest';
import { publicAppFactory } from '../../../src/publicApp';

describe('Public App default routes', () => {
  test('Should return a 404 when the path is not found', async () => {
    const appNoAuth = publicAppFactory();

    const response = await supertest(appNoAuth).get(
      '/public/some-invalid-path',
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found',
    });
  });

  test('Should support cors', async () => {
    const app = publicAppFactory();

    const { headers, status } = await supertest(app).get('/public/healthcheck');

    expect(status).toBe(200);
    expect(headers['access-control-allow-origin']).toEqual('*');
  });
});
