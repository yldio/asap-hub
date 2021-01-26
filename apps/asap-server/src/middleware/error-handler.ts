import { ErrorRequestHandler } from 'express';
import debug from 'debug';
import { isBoom } from '@hapi/boom';

const logger = debug('asap-server');

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  logger(err.message, err);

  if (isBoom(err)) {
    return res.status(err.output.statusCode).json(err.output.payload);
  }

  res.status(err.status || err.statusCode || 500);

  return res.json({
    status: 'ERROR',
    message: err.message,
  });
};
