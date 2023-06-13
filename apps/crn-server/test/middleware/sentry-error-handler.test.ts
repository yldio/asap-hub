import { shouldHandleError } from '@asap-hub/server-common';
import * as Sentry from '@sentry/serverless';
import { Router } from 'express';
import supertest from 'supertest';
import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';

const mockShouldHandleError: jest.MockedFunction<typeof shouldHandleError> =
  jest.fn();
jest.mock('@asap-hub/server-common', () => ({
  ...jest.requireActual('@asap-hub/server-common'),
  shouldHandleError: jest.fn((callback) => callback(mockShouldHandleError)),
}));

beforeEach(jest.resetAllMocks);

describe('Sentry Error middleware', () => {
  test('Should handle any thrown error', async () => {
    const mockRoutes = Router();
    const err = new Error('error');
    mockRoutes.get('/example', async (_, __) => {
      throw err;
    });

    const app = appFactory({
      logger: loggerMock,
      mockRequestHandlers: [mockRoutes],
      authHandler: authHandlerMock,
      sentryErrorHandler: Sentry.Handlers.errorHandler,
    });

    const response = await supertest(app).get('/example');

    expect(shouldHandleError).toHaveBeenCalledWith(err);
    expect(response.status).toBe(500);
  });

  test('Should handle any unhandled rejection', async () => {
    const mockRoutes = Router();
    const err = new Error('error');
    mockRoutes.get('/example', async (_, __) => Promise.reject(err));

    const app = appFactory({
      logger: loggerMock,
      mockRequestHandlers: [mockRoutes],
      authHandler: authHandlerMock,
      sentryErrorHandler: Sentry.Handlers.errorHandler,
    });

    const response = await supertest(app).get('/example');

    expect(shouldHandleError).toHaveBeenCalledWith(err);
    expect(response.status).toBe(500);
  });
});
