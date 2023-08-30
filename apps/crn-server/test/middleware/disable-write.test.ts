import { Router } from 'express';
import supertest from 'supertest';

import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';
import { loggerMock } from '../mocks/logger.mock';

describe('Disable Write Middleware', () => {
  const mockRoutes = Router();

  const app = appFactory({
    logger: loggerMock,
    mockRequestHandlers: [mockRoutes],
    authHandler: authHandlerMock,
  });

  test('should return 405 for PUT request', async () => {
    const response = await supertest(app).put('/');
    expect(response.status).toBe(405);
    expect(response.body.message).toBe('Method Not Allowed');
  });

  test('should return 405 for POST request', async () => {
    const response = await supertest(app).post('/');
    expect(response.status).toBe(405);
    expect(response.body.message).toBe('Method Not Allowed');
  });

  test('should return 405 for PATCH request', async () => {
    const response = await supertest(app).patch('/');
    expect(response.status).toBe(405);
    expect(response.body.message).toBe('Method Not Allowed');
  });
});
