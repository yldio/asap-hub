import { Router } from 'express';
import supertest from 'supertest';
import * as Sentry from '@sentry/serverless';
import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';
import * as util from '../../src/utils/should-handle-error';

describe('Sentry Error middleware', () => {
  test('Should handle any thrown error', async () => {
    const mockRoutes = Router();
    const err = new Error('error');
    mockRoutes.get('/example', async (req, res) => {
      throw err;
    });

    const spy = jest.spyOn(util, 'shouldHandleError');
    const app = appFactory({
      logger: loggerMock,
      mockRequestHandlers: [mockRoutes],
      authHandler: authHandlerMock,
      sentryErrorHandler: Sentry.Handlers.errorHandler,
    });

    const response = await supertest(app).get('/example');

    expect(spy).toHaveBeenCalledWith(err);
    expect(response.status).toBe(500);
  });

  test('Should handle any unhandled rejection', async () => {
    const mockRoutes = Router();
    const err = new Error('error');
    mockRoutes.get('/example', async (req, res) => {
      return Promise.reject(err);
    });

    const spy = jest.spyOn(util, 'shouldHandleError');
    const app = appFactory({
      logger: loggerMock,
      mockRequestHandlers: [mockRoutes],
      authHandler: authHandlerMock,
      sentryErrorHandler: Sentry.Handlers.errorHandler,
    });

    const response = await supertest(app).get('/example');

    expect(spy).toHaveBeenCalledWith(err);
    expect(response.status).toBe(500);
  });
});
