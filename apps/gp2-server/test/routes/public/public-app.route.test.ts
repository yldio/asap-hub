import supertest from 'supertest';
import { publicAppFactory } from '../../../src/publicApp';
import { outputControllerMock } from '../../mocks/output.controller.mock';

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

  test('Should cache the response and not call the controller again for the same parameters', async () => {
    const app = publicAppFactory({
      outputController: outputControllerMock,
    });

    const { headers: headers1 } = await supertest(app).get(
      '/public/outputs/output-id',
    );
    await supertest(app).get('/public/outputs/output-id');

    expect(outputControllerMock.fetchById).toHaveBeenCalledTimes(1);
    expect(headers1['cache-control']).toEqual('max-age=3600');
  });

  test('Should call the controller each time when a different request parameter is used', async () => {
    const app = publicAppFactory({
      outputController: outputControllerMock,
    });

    outputControllerMock.fetch.mockReset();

    await supertest(app).get('/public/outputs');
    await supertest(app).get('/public/outputs?take=5');

    expect(outputControllerMock.fetch).toHaveBeenCalledTimes(2);
  });
});
