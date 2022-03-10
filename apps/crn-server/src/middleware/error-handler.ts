import { ErrorRequestHandler } from 'express';
import { isBoom } from '@hapi/boom';

export const errorHandlerFactory =
  (): ErrorRequestHandler => (err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }

    req.log.error(err);

    // add error to the trace
    req.span?.log({ 'error.error': err });
    req.span?.log({ 'error.message': err.message });

    if (isBoom(err)) {
      return res.status(err.output.statusCode).json(err.output.payload);
    }

    res.status(err.status || err.statusCode || 500);

    return res.json({
      status: 'ERROR',
      message: err.message,
    });
  };
