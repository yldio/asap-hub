import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Validation } from '@asap-hub/validation';
import {
  validateFetchUsersOptions,
  validateUserInviteParameters,
} from '@asap-hub/server-common';
import Boom, { isBoom } from '@hapi/boom';
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import {
  validateUserParameters,
  validateUserPatchRequest,
} from '../validation/user.validation';

const { isUserOnboardable } = gp2Validation;
export const userPublicRouteFactory = (
  userController: UserController,
): Router =>
  Router().get<{ code: string }, UserPublicResponse>(
    '/users/invites/:code',
    async (req, res) => {
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
    .get<gp2Model.FetchUsersOptions, gp2Model.ListUserResponse>(
      '/users',
      async (req, res) => {
        const options = validateFetchUsersOptions(req.query);
        const userFetchOptions = {
          ...options,
          filter: options.filter,
        };

        const users = await userController.fetch(userFetchOptions);

        res.json(users);
      },
    )
    .get<{ userId: string }, gp2Model.UserResponse>(
      '/users/:userId',
      async (req, res) => {
        const { userId } = validateUserParameters(req.params);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const loggedInUserId = req.loggedInUser!.id;
        const user = await userController.fetchById(userId, loggedInUserId);

        res.json(user);
      },
    )
    .patch<gp2Model.UserPatchRequest, gp2Model.UserResponse>(
      '/users/:userId',
      async (req, res) => {
        const { params, body, loggedInUser } = req;
        const { userId } = validateUserParameters(params);

        const payload = validateUserPatchRequest(body);

        // user is trying to update someone else
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (loggedInUser!.id !== userId) {
          throw Boom.forbidden();
        }

        const { onboarded, ...userProfileUpdate } = payload;

        const updatedUser = await userController.update(
          userId,
          userProfileUpdate,
          userId,
        );

        const saveOnboarded = (): Promise<gp2Model.UserResponse> => {
          if (!isUserOnboardable(updatedUser).isOnboardable) {
            throw Boom.badData('User profile is not complete');
          }

          return userController.update(userId, { onboarded: true }, userId);
        };
        const userResponse = onboarded ? await saveOnboarded() : updatedUser;

        res.json(userResponse);
      },
    );
type UserPublicResponse = Pick<gp2Model.UserResponse, 'id' | 'displayName'>;
