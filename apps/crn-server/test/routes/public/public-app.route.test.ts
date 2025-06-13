import supertest from 'supertest';
import { publicAppFactory } from '../../../src/publicApp';
import { researchOutputControllerMock } from '../../mocks/research-output.controller.mock';

describe('Public App default routes', () => {
  beforeAll(() => {
    jest.useFakeTimers({ legacyFakeTimers: true });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

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
      researchOutputController: researchOutputControllerMock,
    });

    const { headers: headers1 } = await supertest(app).get(
      '/public/research-outputs/output-id',
    );
    await supertest(app).get('/public/research-outputs/output-id');

    expect(researchOutputControllerMock.fetchById).toHaveBeenCalledTimes(1);
    expect(headers1['cache-control']).toEqual('max-age=3600');
  });

  test('Should call the controller each time when a different request parameter is used', async () => {
    const app = publicAppFactory({
      researchOutputController: researchOutputControllerMock,
    });

    researchOutputControllerMock.fetch.mockReset();

    await supertest(app).get('/public/research-outputs');
    await supertest(app).get('/public/research-outputs?take=5');

    expect(researchOutputControllerMock.fetch).toHaveBeenCalledTimes(2);
  });

  test('Should call the controller twice when it gets called after an hour', async () => {
    const app = publicAppFactory({
      researchOutputController: researchOutputControllerMock,
    });

    await supertest(app).get('/public/research-outputs/output-id-cache-1-hour');

    // advance by 1 hour and 5 second
    jest.advanceTimersByTime(3605000);

    await supertest(app).get('/public/research-outputs/output-id-cache-1-hour');

    expect(researchOutputControllerMock.fetchById).toHaveBeenCalledTimes(2);
  });
});
