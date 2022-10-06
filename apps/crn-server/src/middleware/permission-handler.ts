import Boom from '@hapi/boom';
import { RequestHandler } from 'express';

export const permissionHandler: RequestHandler = async (req, _res, next) => {
  if (!req.loggedInUser || req.loggedInUser.onboarded !== true) {
    throw Boom.forbidden('User is not onboarded');
  }

  if (req.loggedInUser.alumniSinceDate) {
    throw Boom.forbidden('User is an alumni');
  }

  next();
};
