import { Request, Response, NextFunction } from 'express';
import { configureScope } from '@sentry/serverless';

export const sentryTransactionIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  req.log.debug(`header ${JSON.stringify(req.header)}`);
  req.log.debug(`headers ${JSON.stringify(req.headers)}`);
  const transactionId = req.header('X-Request-Id');
  if (transactionId) {
    configureScope((scope) => {
      scope.setTag('transaction_id', transactionId);
    });
  } else {
    req.log.warn(`No transaction id on request to ${req.originalUrl}`);
  }
  return next();
};
