import { RequestHandler } from 'express';
import Boom from '@hapi/boom';
import { UserResponse } from '@asap-hub/model';
import Intercept from 'apr-intercept';
import { Logger } from '../utils/logger';
import { DecodeToken } from '../utils/validate-token';
import { CacheClient } from '../clients/cache.client';

export const authHandlerFactory =
  (
    decodeToken: DecodeToken,
    fetchByCode: (code: string) => Promise<UserResponse>,
    cacheClient: CacheClient<UserResponse>,
    logger: Logger,
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

    if (!payload.sub) {
      logger.error(err, 'Missing sub from JWT token');
      throw Boom.unauthorized();
    }

    let user: UserResponse | null = cacheClient.get(payload.sub);

    if (user === null) {
      try {
        user = await fetchByCode(payload.sub);
      } catch (error) {
        logger.error(error, 'Error fetching user details');
        throw Boom.unauthorized();
      }

      cacheClient.set(payload.sub, user);
    }

    if (!user || typeof user === 'string') {
      logger.error('User payload not found');
      throw Boom.unauthorized();
    }

    req.loggedInUser = user;

    next();
  };

export type AuthHandler = ReturnType<typeof authHandlerFactory>;
