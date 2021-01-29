import { Router } from 'express';
import supertest from 'supertest';
import * as LightStep from 'lightstep-tracer';
import Boom from '@hapi/boom';

import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';

describe('Tracing middleware', () => {
  Object.assign(process.env, { NODE_ENV: 'prod' });

  const mockRoutes = Router();
  mockRoutes.get('/test-success-route', async (req, res) => {
    return res.json({ response: 'OK' });
  });

  mockRoutes.get('/test-failure-route', async (req, res) => {
    throw Boom.serverUnavailable();
  });

  const tracer = new LightStep.Tracer({
    access_token: '',
    component_name: 'asap-hub-testing',
  });

  const app = appFactory({
    mockRequestHandlers: [mockRoutes],
    authHandler: authHandlerMock,
    tracer,
  });

  test('Should safely trace request', async () => {
    const response = await supertest(app).get('/test-success-route');

    expect(response.status).toBe(200);
  });

  test('Should safely log error when theres one', async () => {
    const response = await supertest(app).get('/test-failure-route');

    expect(response.status).toBe(503);
  });
});
