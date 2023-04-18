import { configureScope } from '@sentry/serverless';
import { NextFunction, Request, Response } from 'express';

export const sentryTransactionIdMiddleware = (
  req: Request<unknown>,
  _res: Response,
  next: NextFunction,
): void => {
  const transactionId = req.header('X-Transaction-Id');
  if (transactionId) {
    configureScope((scope) => {
      scope.setTag('transaction_id', transactionId);
    });
  } else {
    req.log.warn(`No transaction id on request to ${req.originalUrl}`);
  }
  return next();
};
