import Boom from '@hapi/boom';
import Intercept from 'apr-intercept';
import { createHash } from 'crypto';
import { Request, RequestHandler } from 'express';
import { CacheClient } from '../clients/cache.client';
import { Logger } from '../utils/logger';
import { DecodeToken } from '../utils/validate-token';

interface AssignUserToContext<TUserResponse> {
  (req: Request, user: TUserResponse): void;
}

export const authHandlerFactory =
  <TUserResponse>(
    decodeToken: DecodeToken,
    fetchByCode: (code: string) => Promise<TUserResponse>,
    cacheClient: CacheClient<TUserResponse>,
    logger: Logger,
    assignUserToContext: AssignUserToContext<TUserResponse>,
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

    const tokenHash = createHash('sha256').update(token).digest('hex');
    let user = cacheClient.get(tokenHash);

    if (user === null) {
      try {
        user = await fetchByCode(payload.sub);
      } catch (error) {
        logger.error(error, 'Error fetching user details');
        throw Boom.unauthorized();
      }

      cacheClient.set(tokenHash, user);
    }

    if (!user || typeof user === 'string') {
      logger.error('User payload not found');
      throw Boom.unauthorized();
    }

    assignUserToContext(req, user);

    next();
  };

export type AuthHandler = ReturnType<typeof authHandlerFactory>;
