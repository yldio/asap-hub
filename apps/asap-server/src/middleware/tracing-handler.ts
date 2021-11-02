import { RequestHandler } from 'express';
import * as opentracing from 'opentracing';
import * as url from 'url';

export const tracingHandlerFactory =
  (tracer?: opentracing.Tracer): RequestHandler =>
  async (req, res, next) => {
    // stop tracing during testing
    if (!tracer || process.env.NODE_ENV === 'test') {
      return next();
    }

    const wireCtx =
      tracer.extract(opentracing.FORMAT_HTTP_HEADERS, req.headers) || undefined;
    const pathname = url.parse(req.url).pathname || 'Unknown Operation';
    const span = tracer.startSpan(pathname, { childOf: wireCtx });
    span.log({ event: 'request_received' });

    // include some useful tags on the trace
    span.setTag('http.method', req.method);
    span.setTag('span.kind', 'server');
    span.setTag('http.url', req.url);

    // include trace ID in headers so that we can debug slow requests we see in
    // the browser by looking up the trace ID found in response headers
    const responseHeaders: Record<string, string | number | string[]> = {};
    tracer.inject(span, opentracing.FORMAT_TEXT_MAP, responseHeaders);
    Object.entries(responseHeaders).forEach(([key, value]) =>
      res.setHeader(key, value),
    );

    // add the span to the request object for handlers to use
    Object.assign(req, { span });

    res.on('finish', () => {
      span.log({ event: 'response_finished' });
      span.setOperationName(req.route?.path || pathname);
      span.setTag('http.status_code', res.statusCode);

      if (res.statusCode >= 500) {
        span.setTag('error', true);
        span.setTag('sampling.priority', 1);
      }
    });

    res.on('close', () => {
      span.log({ event: 'response_closed' });
      span.finish();
    });

    return next();
  };
