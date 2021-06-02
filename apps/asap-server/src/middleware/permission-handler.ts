import Boom from '@hapi/boom';
import { RequestHandler } from 'express';

export const permissionHandler: RequestHandler = async (req, _res, next) => {
  if (!req.loggedUser || req.loggedUser.onboarded !== true) {
    throw Boom.forbidden('User is not onboarded');
  }

  next();
};
