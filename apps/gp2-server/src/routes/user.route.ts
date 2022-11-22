import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Validation } from '@asap-hub/validation';
import {
  validateFetchUsersOptions,
  validateUserInviteParameters,
} from '@asap-hub/server-common';
import Boom, { isBoom } from '@hapi/boom';
import { Response, Router } from 'express';
import { UserController } from '../controllers/user.controller';
import {
  validateUserParameters,
  validateUserPatchRequest,
} from '../validation/user.validation';

const { isUserOnboardable } = gp2Validation;
export const userPublicRouteFactory = (
  userController: UserController,
): Router =>
  Router().get<{ code: string }>(
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

export const userRouteFactory = (userController: UserController): Router =>
  Router()
    .get('/users', async (req, res) => {
      const options = validateFetchUsersOptions(req.query);
      const userFetchOptions = {
        ...options,
        filter: options.filter,
      };

      const users = await userController.fetch(userFetchOptions);

      res.json(users);
    })
    .get<{ userId: string }>('/users/:userId', async (req, res) => {
      const { userId } = validateUserParameters(req.params);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const loggedInUserId = req.loggedInUser!.id;
      const user = await userController.fetchById(userId, loggedInUserId);

      res.json(user);
    })
    .patch('/users/:userId', async (req, res) => {
      const { userId } = validateUserParameters(req.params);

      const payload = validateUserPatchRequest(req.body);

      // user is trying to update someone else
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (req.loggedInUser!.id !== userId) {
        throw Boom.forbidden();
      }

      const { onboarded, ...userProfileUpdate } = payload;

      const result = await userController.update(
        userId,
        userProfileUpdate,
        userId,
      );

      if (onboarded === true) {
        if (!isUserOnboardable(result).isOnboardable) {
          throw Boom.badData('User profile is not complete');
        }

        await userController.update(userId, { onboarded }, userId);

        res.json({
          ...result,
          onboarded,
        });

        return;
      }

      res.json(result);
    });
type UserPublicResponse = Pick<gp2Model.UserResponse, 'id' | 'displayName'>;
