import { RequestHandler } from 'express';
import { Tracer } from 'opentracing';
import middleware from 'opentracing-express-middleware';
import { promisify } from 'util';

interface LightstepTracer extends Tracer {
  flush(): Promise<void>;
}

export const tracingHandler = (tracer?: Tracer): RequestHandler => async (
  req,
  res,
  next,
) => {
  if (!tracer) {
    return next();
  }

  // force flush to push metrics out of lambda
  res.on('close', async () => {
    const lsTracer = tracer as LightstepTracer;
    if (lsTracer.flush) {
      const flushTracing = promisify(lsTracer.flush).bind(lsTracer);
      await flushTracing();
    }
  });

  return middleware({ tracer })(req, res, next);
};
