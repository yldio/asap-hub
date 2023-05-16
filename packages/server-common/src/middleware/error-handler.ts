import { GenericError, NotFoundError, ValidationError } from '@asap-hub/errors';
import { ErrorResponse } from '@asap-hub/model';
import { isBoom } from '@hapi/boom';
import * as Sentry from '@sentry/serverless';
import { ErrorRequestHandler } from 'express';
import { HTTPError } from 'got';

export const errorHandlerFactory =
  (): ErrorRequestHandler<unknown, ErrorResponse> => (err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }

    req.log.error(err);

    // add error to the trace
    req.span?.log({ 'error.error': err });
    req.span?.log({ 'error.message': err.message });

    if (err instanceof GenericError) {
      if (err.cause instanceof HTTPError) {
        req.log.error(err.cause);

        Sentry.setContext('asapHttpError', {
          response: JSON.stringify(err.cause.response?.body),
        });
      }

      if (err instanceof NotFoundError) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Not Found',
          statusCode: 404,
        });
      }

      if (err instanceof ValidationError) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Validation Error',
          statusCode: 400,
        });
      }
    }

    if (isBoom(err)) {
      return res.status(err.output.statusCode).json({
        ...err.output.payload,
        data: err.data,
      });
    }

    res.status(err.status || err.statusCode || 500);

    return res.json({
      error: 'Internal Server Error',
      message: err.message,
      statusCode: err.status || err.statusCode || 500,
    });
  };
