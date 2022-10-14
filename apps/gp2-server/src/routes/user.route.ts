import { UserResponse } from '@asap-hub/model';
import {
  validateFetchUsersOptions,
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
        const user = await userController.fetchByCode(code);

        res.json({
          id: user.id,
          displayName: user.displayName,
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
    const options = validateFetchUsersOptions(req.query);
    const userFetchOptions = {
      ...options,
      filter: options.filter,
    };

    const users = await userController.fetch(userFetchOptions);

    res.json(users);
  });

  userRoutes.get<{ userId: string }>('/users/:userId', async (req, res) => {
    const { userId } = validateUserParameters(req.params);

    const user = await userController.fetchById(userId);

    res.json(user);
  });

  return userRoutes;
};
type UserPublicResponse = Pick<UserResponse, 'id' | 'displayName'>;
