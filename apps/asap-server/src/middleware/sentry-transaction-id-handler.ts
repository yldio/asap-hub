import { Request, Response, NextFunction } from 'express';
import { configureScope } from '@sentry/serverless';

export const sentryTransactionIdMiddleware = (
  req: Request,
  res: Response,
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
