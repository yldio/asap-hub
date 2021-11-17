import { RequestHandler } from 'express';

export const sentryTransactionIdHandlerMock: RequestHandler = (
  _req,
  _res,
  next,
) => {
  return next();
};
