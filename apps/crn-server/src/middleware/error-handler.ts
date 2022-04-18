import { ErrorRequestHandler } from 'express';
import { isBoom } from '@hapi/boom';
import { CRNError } from '@asap-hub/errors';
import { ErrorResponse } from '@asap-hub/model';

export const errorHandlerFactory =
  (): ErrorRequestHandler<unknown, ErrorResponse> => (err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }

    req.log.error(err);

    // add error to the trace
    req.span?.log({ 'error.error': err });
    req.span?.log({ 'error.message': err.message });

    if (isBoom(err)) {
      return res.status(err.output.statusCode).json({
        ...err.output.payload,
        data: err.data,
      });
    }

    if (CRNError.isCRNError(err)) {
      return res.status(err.statusCode).json({
        error: err.error,
        statusCode: err.statusCode,
        message: err.message,
        data: err.data as any
      });
    }

    res.status(err.status || err.statusCode || 500);

    return res.json({
      error: 'Internal Server Error',
      message: err.message,
      statusCode: err.status || err.statusCode || 500,
    });
  };
