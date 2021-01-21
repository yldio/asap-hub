import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // eslint-disable-next-line no-console
  console.error({ err });

  res.status(err.status || err.statusCode || 500);

  return res.json({
    status: 'ERROR',
    message: err.message,
  });
};
