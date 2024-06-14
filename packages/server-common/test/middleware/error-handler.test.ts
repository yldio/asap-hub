import 'express-async-errors';
import supertest from 'supertest';
import { HTTPError, Response } from 'got';
import express, { Router } from 'express';
import { NotFoundError, ValidationError } from '@asap-hub/errors';
import Boom from '@hapi/boom';
import { userMock } from '@asap-hub/auth';
import { loggerMock } from '../mocks/logger.mock';
import { getHttpLogger } from '../../src/utils/logger';
import { errorHandlerFactory } from '../../src/middleware/error-handler';

class CustomError extends Error {
  status?: number;
}

describe.each([
  {
    description: 'with logger',
    errorHandler: errorHandlerFactory(loggerMock),
    timesCalled: 2,
  },
  {
    description: 'without logger',
    errorHandler: errorHandlerFactory(),
    timesCalled: 1,
  },
])('Error handling $description', ({ errorHandler, timesCalled }) => {
  beforeEach(() => jest.clearAllMocks());
  const errorRoutes = Router();

  errorRoutes.get('/events/error-route', async () => {
    throw new Error('error message');
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

  const httpLogger = getHttpLogger({ logger: loggerMock });

  const app = express();
  app.use(httpLogger);
  app.use((req, _res, next) => {
    req['loggedInUser'] = userMock;
    return next();
  });
  app.use(errorRoutes);
  app.use(errorHandler);

  test('Should log the error and return status 500 along with the error message', async () => {
    const response = await supertest(app).get('/events/error-route');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: 'Internal Server Error',
      message: 'error message',
      statusCode: 500,
    });
    expect(loggerMock.error).toHaveBeenCalledWith(expect.any(Error));
    expect(loggerMock.error).toHaveBeenCalledTimes(timesCalled);
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

  describe('Asap error handling', () => {
    errorRoutes.get('/asap/validation', async () => {
      throw new ValidationError(new HTTPError({} as Response));
    });
    errorRoutes.get('/asap/notfound', async () => {
      throw new NotFoundError(
        new HTTPError({} as Response),
        'resource not found',
      );
    });

    test('404 on Not Found Error', async () => {
      const response = await supertest(app).get('/asap/notfound');

      expect(loggerMock.error).toHaveBeenCalledWith(expect.any(NotFoundError));

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Not Found',
        message: 'resource not found',
        statusCode: 404,
      });
    });

    test('400 on Validation Error', async () => {
      const response = await supertest(app).get('/asap/validation');

      expect(loggerMock.error).toHaveBeenCalledWith(
        expect.any(ValidationError),
      );

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Bad Request',
        message: 'Validation Error',
        statusCode: 400,
      });
    });
  });
});
