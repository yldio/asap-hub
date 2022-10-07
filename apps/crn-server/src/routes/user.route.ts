/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { UserResponse } from '@asap-hub/model';
import {
  validateFetchOptions,
  validateUserInviteParameters,
} from '@asap-hub/server-common';
import { isUserOnboardable } from '@asap-hub/validation';
import Boom, { isBoom } from '@hapi/boom';
import { Response, Router } from 'express';
import parseURI from 'parse-data-url';
import { GroupController } from '../controllers/groups';
import { UserController } from '../controllers/users';
import { permissionHandler } from '../middleware/permission-handler';
import {
  validateUserParameters,
  validateUserPatchRequest,
  validateUserPostRequestInput,
} from '../validation/user.validation';

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

export const userRouteFactory = (
  userController: UserController,
  groupsController: GroupController,
): Router => {
  const userRoutes = Router();

  userRoutes.get('/users', permissionHandler, async (req, res) => {
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

    if (
      req.loggedInUser?.onboarded !== true &&
      userId !== req.loggedInUser?.id
    ) {
      throw Boom.forbidden('User is not onboarded');
    }

    const result = await userController.fetchById(userId);

    if (result.onboarded === false && result.id !== req.loggedInUser?.id) {
      throw Boom.notFound();
    }

    res.json(result);
  });

  userRoutes.get<{ userId: string }>(
    '/users/:userId/groups',
    async (req, res) => {
      const { params } = req;

      const { userId } = validateUserParameters(params);

      const result = await groupsController.fetchByUserId(userId);

      res.json(result);
    },
  );

  userRoutes.post('/users/:userId/avatar', async (req, res) => {
    const { userId } = validateUserParameters(req.params);

    // user is trying to update someone else
    if (req.loggedInUser!.id !== userId) {
      throw Boom.forbidden();
    }

    const payload = validateUserPostRequestInput(req.body);

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

  userRoutes.patch('/users/:userId', async (req, res) => {
    const { userId } = validateUserParameters(req.params);

    const payload = validateUserPatchRequest(req.body);

    // user is trying to update someone else
    if (req.loggedInUser!.id !== userId) {
      throw Boom.forbidden();
    }

    // user trying to change a team he doesn't belong to
    if (
      payload.teams &&
      !payload.teams.every(({ id }: { id: string }) =>
        req.loggedInUser!.teams.find((t) => t.id === id),
      )
    ) {
      throw Boom.forbidden();
    }

    // user is an alumni
    if (req.loggedInUser!.alumniSinceDate) {
      throw Boom.forbidden('User is an alumni');
    }

    const { onboarded, ...userProfileUpdate } = payload;

    const result = await userController.update(userId, userProfileUpdate);

    if (onboarded === true) {
      if (!isUserOnboardable(result).isOnboardable) {
        throw Boom.badData('User profile is not complete');
      }

      await userController.update(userId, { onboarded });

      res.json({
        ...result,
        onboarded,
      });

      return;
    }

    res.json(result);
  });

  return userRoutes;
};

type UserPublicResponse = Pick<UserResponse, 'id' | 'displayName'>;
