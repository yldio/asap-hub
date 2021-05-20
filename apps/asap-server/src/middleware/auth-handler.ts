import { RequestHandler } from 'express';
import Boom from '@hapi/boom';
import Intercept from 'apr-intercept';
import { DecodeToken } from '../utils/validate-token';
import { origin } from '../config';

export const authHandlerFactory =
  (decodeToken: DecodeToken): RequestHandler =>
  async (req, _res, next) => {
    const { headers } = req;

    if (!headers.authorization) {
      throw Boom.unauthorized();
    }

    const [type, token] = headers.authorization.split(' ');

    if (type.toLowerCase() !== 'bearer') {
      throw Boom.unauthorized();
    }

    const [err, payload] = await Intercept(decodeToken(token));

    if (err) {
      throw Boom.unauthorized();
    }

    const user = payload[`${origin}/user`];

    if (!user || typeof user === 'string') {
      throw Boom.unauthorized();
    }

    req.loggedUser = user;
    req.span?.setBaggageItem('user.id', user.id);

    next();
  };

export type AuthHandler = ReturnType<typeof authHandlerFactory>;
