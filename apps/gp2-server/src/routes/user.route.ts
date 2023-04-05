import { gp2 as gp2Model } from '@asap-hub/model';
import {
  validateFetchUsersOptions,
  validateUserInviteParameters,
} from '@asap-hub/server-common';
import { gp2 as gp2Validation } from '@asap-hub/validation';
import Boom, { isBoom } from '@hapi/boom';
import { Router } from 'express';
import parseURI from 'parse-data-url';
import { UserController } from '../controllers/user.controller';
import { permissionHandler } from '../middleware/permission-handler';
import {
  validateUserParameters,
  validateUserPatchRequest,
  validateUserPostRequestInput,
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
      permissionHandler,
      async (req, res) => {
        const options = validateFetchUsersOptions(req.query);

        if (
          options.filter?.onlyOnboarded === false &&
          req.loggedInUser?.role !== 'Administrator'
        ) {
          throw Boom.forbidden(
            'Only administrators can list unonboarded users',
          );
        }

        const users = await userController.fetch(options);

        res.json(users);
      },
    )
    .get<{ userId: string }, gp2Model.UserResponse>(
      '/users/:userId',
      async (req, res) => {
        const { userId } = validateUserParameters(req.params);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const loggedInUserId = req.loggedInUser!.id;

        if (
          req.loggedInUser?.onboarded !== true &&
          userId !== req.loggedInUser?.id
        ) {
          throw Boom.forbidden('User is not onboarded');
        }

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
        );

        const saveOnboarded = (): Promise<gp2Model.UserResponse> => {
          if (!isUserOnboardable(updatedUser).isOnboardable) {
            throw Boom.badData('User profile is not complete');
          }

          return userController.update(userId, { onboarded: true });
        };
        const userResponse = onboarded ? await saveOnboarded() : updatedUser;

        res.json(userResponse);
      },
    )
    .post('/users/:userId/avatar', async (req, res) => {
      const { params, body, loggedInUser } = req;
      const { userId } = validateUserParameters(params);

      // user is trying to update someone else
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (loggedInUser!.id !== userId) {
        throw Boom.forbidden();
      }
      const payload = validateUserPostRequestInput(body);
      const parsed = parseURI(payload.avatar);
      if (!parsed) {
        throw Boom.badRequest('avatar must be a valid data URL');
      }
      if (!parsed.contentType.startsWith('image')) {
        throw Boom.unsupportedMediaType('Content-type must be image');
      }
      const avatar = parsed.toBuffer();
      // convert bytes to MB and check size
      // 3MB = 2.8MB (2MB Base64 image) + some slack
      if (avatar.length / 1e6 > 3) {
        throw Boom.entityTooLarge('Avatar must be smaller than 2MB');
      }
      const result = await userController.updateAvatar(
        userId,
        avatar,
        parsed.contentType,
      );
      res.json(result);
    });

type UserPublicResponse = Pick<gp2Model.UserResponse, 'id' | 'displayName'>;
