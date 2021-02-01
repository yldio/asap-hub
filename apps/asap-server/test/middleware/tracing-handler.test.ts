import { Router } from 'express';
import supertest from 'supertest';
import Boom from '@hapi/boom';
import { MockTracer } from 'opentracing';

import { appFactory } from '../../src/app';
import { authHandlerMock } from '../mocks/auth-handler.mock';

interface MockLightstepTracer extends MockTracer {
  flush(): Promise<void>;
}

describe('Tracing middleware', () => {
  const mockRoutes = Router();

  let reqSpanPresent = false;
  mockRoutes.get('/test-success-route', async (req, res) => {
    if (req.span) {
      reqSpanPresent = true;
    }
    return res.json({ response: 'OK' });
  });

  mockRoutes.get('/test-failure-route', async (req, res) => {
    if (req.span) {
      reqSpanPresent = true;
    }
    throw Boom.serverUnavailable();
  });

  const mockTracer = (new MockTracer() as unknown) as MockLightstepTracer;
  const startSpanSpy = jest.spyOn(mockTracer, 'startSpan');
  mockTracer.inject = () => {};
  mockTracer.extract = () => null;
  mockTracer.flush = jest.fn();

  const app = appFactory({
    mockRequestHandlers: [mockRoutes],
    authHandler: authHandlerMock,
    tracer: mockTracer,
  });

  beforeEach(() => {
    mockTracer.clear();
    reqSpanPresent = false;
    jest.clearAllMocks();
  });

  test('Should safely trace request', async () => {
    const response = await supertest(app).get('/test-success-route');
    expect(response.status).toBe(200);
    expect(reqSpanPresent).toBe(true);
    expect(startSpanSpy).toHaveBeenCalledTimes(1);

    const { spans } = mockTracer.report();
    const [span] = spans;
    expect(span.tags()).toStrictEqual({
      'http.method': 'GET',
      'span.kind': 'server',
      'http.url': '/test-success-route',
      'http.status_code': 200,
    });
    expect(span.operationName()).toEqual('/test-success-route');
    expect(mockTracer.flush).toHaveBeenCalled();
  });

  test('Should safely log error when theres one', async () => {
    const response = await supertest(app).get('/test-failure-route');
    expect(response.status).toBe(503);
    expect(reqSpanPresent).toBe(true);
    expect(startSpanSpy).toHaveBeenCalledTimes(1);

    const { spans } = mockTracer.report();
    const [span] = spans;
    expect(span.tags()).toStrictEqual({
      error: true,
      'http.method': 'GET',
      'span.kind': 'server',
      'http.url': '/test-failure-route',
      'http.status_code': 503,
      'sampling.priority': 1,
    });
    expect(span.operationName()).toEqual('/test-failure-route');
    expect(mockTracer.flush).toHaveBeenCalled();
  });
});
