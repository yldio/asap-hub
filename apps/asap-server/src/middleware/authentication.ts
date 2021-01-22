import { RequestHandler } from 'express';
import Boom from '@hapi/boom';

import decodeToken from '../utils/validate-token';

export const authHandler: RequestHandler = async (req, res, next) => {
  const headers = req.headers

  if (!headers.authorization) {
    throw Boom.unauthorized()
  }

  const [type, token] = headers.authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    throw Boom.unauthorized()
  }

  await decodeToken(token).catch(() => {
    return next(Boom.unauthorized())
  })

  next()
};
