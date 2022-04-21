import supertest from 'supertest';
import { Router } from 'express';
import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';
import {
  SquidexNotFoundError,
  SquidexUnauthorizedError,
  SquidexValidationError,
} from '@asap-hub/squidex';
import Boom from '@hapi/boom';

class CustomError extends Error {
  status?: number;
}

describe('Error handling', () => {
  const errorRoutes = Router();

  errorRoutes.get('/events/error-route', async () => {
    throw new Error('error message');
  });

  errorRoutes.get('/events/custom-error-route', async () => {
    const error = new CustomError('some custom error message');
    error.status = 422;
    throw error;
  });

  errorRoutes.get('/events/custom-error-route', async () => {
    const error = new CustomError('some custom error message');
    error.status = 422;
    throw error;
  });

  const validationErrors = [
    {
      instancePath: '/param',
      schemaPath: '#/properties/param/type',
      keyword: 'type',
      params: {
        type: 'number',
      },
      message: 'must be number',
    },
  ];

  errorRoutes.get('/events/validation-error-route', async () => {
    throw Boom.badRequest(`Validation error`, validationErrors);
  });

  const app = appFactory({
    mockRequestHandlers: [errorRoutes],
    authHandler: authHandlerMock,
    logger: loggerMock,
  });

  test('Should log the error and return status 500 along with the error message', async () => {
    const response = await supertest(app).get('/events/error-route');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      message: 'error message',
      statusCode: 500,
    });
    expect(loggerMock.error).toHaveBeenCalledWith(expect.any(Error));
  });

  test('Should log the error and return a custom error status code', async () => {
    const response = await supertest(app).get('/events/custom-error-route');

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      message: 'some custom error message',
      statusCode: 422,
    });
    expect(loggerMock.error).toHaveBeenCalledWith(expect.any(CustomError));
  });

  test('Should return the validation error along with the extra data', async () => {
    const response = await supertest(app).get('/events/validation-error-route');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Bad Request',
      message: 'Validation error',
      statusCode: 400,
      data: validationErrors,
    });
  });

  describe('Squidex error handling', () => {
    errorRoutes.get('/squidex/unauthorized', async () => {
      throw new SquidexUnauthorizedError();
    });
    errorRoutes.get('/squidex/validation', async () => {
      throw new SquidexValidationError();
    });
    errorRoutes.get('/squidex/notfound', async () => {
      throw new SquidexNotFoundError();
    });

    test('401 on Squidex Unauthorized Error', async () => {
      const response = await supertest(app).get('/squidex/unauthorized');

      expect(loggerMock.error).toHaveBeenCalledWith(
        expect.any(SquidexUnauthorizedError),
      );

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: 'Not Authorized',
        message: '',
        statusCode: 401,
      });
    });

    test('404 on Squidex Not Found Error', async () => {
      const response = await supertest(app).get('/squidex/notfound');

      expect(loggerMock.error).toHaveBeenCalledWith(
        expect.any(SquidexNotFoundError),
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: '',
        statusCode: 404,
      });
    });

    test('401 on Squidex Validation Error', async () => {
      const response = await supertest(app).get('/squidex/validation');

      expect(loggerMock.error).toHaveBeenCalledWith(
        expect.any(SquidexValidationError),
      );

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
        message: '',
        statusCode: 400,
      });
    });
  });
});
