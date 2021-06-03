import { RequestHandler } from 'express';

export const userLoggerHandler: RequestHandler = (req, res, next) => {
  if (req.loggedInUser) {
    req.log = res.log = req.log.child({
      userId: req.loggedInUser.id,
    });
  }
  next();
};
