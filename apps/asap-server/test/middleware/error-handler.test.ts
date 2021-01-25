import supertest from 'supertest';
import { Router } from 'express';
import { appFactory } from '../../src/app';

class CustomError extends Error {
  status?: number;
}

describe('Error handling', () => {
  const errorRoutes = Router();

  errorRoutes.get('/events/error-route', async () => {
    throw new Error('error message');
  });

  errorRoutes.get('/events/custom-error-route', async () => {
    const error = new CustomError();
    error.status = 422;
    throw error;
  });

  const app = appFactory({ mockRequestHandlers: [errorRoutes] });

  test('Should return status 500 and return the error message', async () => {
    const response = await supertest(app).get('/events/error-route');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      status: 'ERROR',
      message: 'error message',
    });
  });

  test('Should return a custom error status code', async () => {
    const response = await supertest(app).get('/events/custom-error-route');

    expect(response.status).toBe(422);
  });
});
