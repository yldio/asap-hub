import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error({ err });

  res.status(err.status || err.statusCode || 500);
  res.json({ error: err.message });
};
