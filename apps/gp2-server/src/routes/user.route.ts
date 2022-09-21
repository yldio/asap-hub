import { UserResponse } from '@asap-hub/model';
import {
  validateFetchOptions,
  validateUserInviteParameters,
} from '@asap-hub/server-common';
import Boom, { isBoom } from '@hapi/boom';
import { Response, Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateUserParameters } from '../validation/user.validation';

export const userPublicRouteFactory = (
  userController: UserController,
): Router => {
  const userPublicRoutes = Router();

  userPublicRoutes.get<{ code: string }>(
    '/users/invites/:code',
    async (req, res: Response<UserPublicResponse>) => {
      const { code } = validateUserInviteParameters(req.params);

      try {
        const result = await userController.fetchByCode(code);

        res.json({
          id: result.id,
          displayName: result.displayName,
        });
      } catch (error) {
        if (isBoom(error, 403)) {
          throw Boom.notFound();
        }

        throw error;
      }
    },
  );

  return userPublicRoutes;
};

export const userRouteFactory = (userController: UserController): Router => {
  const userRoutes = Router();

  userRoutes.get('/users', async (req, res) => {
    const options = validateFetchOptions(req.query);

    const userFetchOptions = {
      ...options,
      filter: options.filter && { role: options.filter },
    };

    const result = await userController.fetch(userFetchOptions);

    res.json(result);
  });

  userRoutes.get<{ userId: string }>('/users/:userId', async (req, res) => {
    const { userId } = validateUserParameters(req.params);

    const result = await userController.fetchById(userId);

    res.json(result);
  });

  return userRoutes;
};
type UserPublicResponse = Pick<UserResponse, 'id' | 'displayName'>;
