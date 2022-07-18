import { UserResponse } from '@asap-hub/model';
import Boom, { isBoom } from '@hapi/boom';
import { Response, Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validateUserInviteParameters } from '../validation/user.validation';

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

type UserPublicResponse = Pick<UserResponse, 'id' | 'displayName'>;
