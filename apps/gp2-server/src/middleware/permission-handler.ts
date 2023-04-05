import Boom from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

export const permissionHandler = (
  req: Request<unknown>,
  _: Response,
  next: NextFunction,
) => {
  if (!req.loggedInUser || req.loggedInUser.onboarded !== true) {
    throw Boom.forbidden('User is not onboarded');
  }

  next();
};
