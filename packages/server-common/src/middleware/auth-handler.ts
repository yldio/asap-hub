import { RequestHandler } from 'express';
import Boom from '@hapi/boom';
import Intercept from 'apr-intercept';
import { Logger } from '../utils/logger';
import { DecodeToken } from '../utils/validate-token';

type AuthHandlerConfig = {
  origin: string;
};

export const authHandlerFactory =
  (
    decodeToken: DecodeToken,
    logger: Logger,
    config: AuthHandlerConfig,
  ): RequestHandler =>
  async (req, _res, next) => {
    const { headers } = req;

    if (!headers.authorization) {
      throw Boom.unauthorized();
    }

    const [type, token] = headers.authorization.split(' ');

    if (type?.toLowerCase() !== 'bearer' || !token) {
      throw Boom.unauthorized();
    }

    const [err, payload] = await Intercept(decodeToken(token));

    if (err) {
      logger.error(err, 'Error while validating token');
      throw Boom.unauthorized();
    }

    const user = payload[`${config.origin}/user`];

    if (!user || typeof user === 'string') {
      logger.error('User payload not found');
      throw Boom.unauthorized();
    }

    req.loggedInUser = user;

    next();
  };

export type AuthHandler = ReturnType<typeof authHandlerFactory>;
