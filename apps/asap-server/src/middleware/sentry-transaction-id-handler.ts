import { RequestHandler } from 'express';
import { configureScope } from '@sentry/serverless';

export const sentryTransactionIdFactory =
  (): RequestHandler => async (req, res, next) => {
    const transactionId = req.header('X-Transaction-Id');
    if (transactionId) {
      configureScope((scope) => {
        scope.setTag('transaction_id', transactionId);
      });
    }
    return next();
  };
