import { ErrorRequestHandler } from 'express';
import { isBoom } from '@hapi/boom';
import { ErrorResponse } from '@asap-hub/model';
import {
  SquidexError,
  SquidexNotFoundError,
  SquidexUnauthorizedError,
  SquidexValidationError,
} from '@asap-hub/squidex';
import * as Sentry from '@sentry/serverless';

export const errorHandlerFactory =
  (): ErrorRequestHandler<unknown, ErrorResponse> => (err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }

    req.log.error(err);

    // add error to the trace
    req.span?.log({ 'error.error': err });
    req.span?.log({ 'error.message': err.message });

    if (err instanceof SquidexError) {
      Sentry.setContext('squidexError', {
        response: JSON.stringify(err.cause),
      });

      if (err instanceof SquidexNotFoundError) {
        return res.status(404).json({
          error: 'Not Found',
          message: err.message,
          statusCode: 404,
        });
      }

      if (err instanceof SquidexUnauthorizedError) {
        return res.status(401).json({
          error: 'Not Authorized',
          message: err.message,
          statusCode: 401,
        });
      }

      if (err instanceof SquidexValidationError) {
        return res.status(400).json({
          error: 'Bad Request',
          message: err.message,
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
