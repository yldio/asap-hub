import { RequestHandler } from 'express';

export const userLoggerHandler: RequestHandler = (req, res, next) => {
  if (req.loggedUser) {
    req.log = res.log = req.log.child({
      userId: req.loggedUser.id,
    });
  }
  next();
};
