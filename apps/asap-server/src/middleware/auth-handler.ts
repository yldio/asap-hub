import { RequestHandler } from 'express';
import Boom from '@hapi/boom';
import { DecodeToken } from '../utils/validate-token';

export const authHandlerFactory = (
  decodeToken: DecodeToken,
): RequestHandler => async (req, _res, next) => {
  const { headers } = req;

  if (!headers.authorization) {
    throw Boom.unauthorized();
  }

  const [type, token] = headers.authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    throw Boom.unauthorized();
  }

  await decodeToken(token).catch(() => next(Boom.unauthorized()));

  next();
};

export type AuthHandler = ReturnType<typeof authHandlerFactory>;
