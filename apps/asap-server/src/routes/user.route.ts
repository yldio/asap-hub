/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Router, Response } from 'express';
import { framework } from '@asap-hub/services-common';
import parseURI from 'parse-data-url';
import Joi from '@hapi/joi';
import Boom, { isBoom } from '@hapi/boom';
import { UserPatchRequest, UserResponse } from '@asap-hub/model';

import { FetchOptions } from '../utils/types';
import { GroupController } from '../controllers/groups';
import { UserController } from '../controllers/users';
import { userUpdateSchema } from '../entities/user';

export const userPublicRouteFactory = (
  userController: UserController,
): Router => {
  const userPublicRoutes = Router();

  userPublicRoutes.get(
    '/users/invites/:code',
    async (req, res: Response<UserPublicResponse>) => {
      const { code } = framework.validate(
        'parameters',
        req.params,
        publicParamSchema,
      );

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

  userRoutes.get('/users', async (req, res) => {
    const options = (framework.validate(
      'query',
      req.query,
      querySchemaWithFilter,
    ) as unknown) as FetchOptions;

    const result = await userController.fetch(options);

    res.json(result);
  });

  userRoutes.get('/users/:userId', async (req, res) => {
    const { userId } = framework.validate(
      'parameters',
      req.params,
      paramSchema,
    );
    const result = await userController.fetchById(userId);

    res.json(result);
  });

  userRoutes.get('/users/:userId/groups', async (req, res) => {
    const { query, params } = req;

    const { userId } = framework.validate('parameters', params, paramSchema);
    const options = (framework.validate(
      'query',
      query,
      querySchema,
    ) as unknown) as FetchOptions;

    const user = await userController.fetchById(userId);
    const teams = user.teams.map((t) => t.id);
    const result = await groupsController.fetchByUserId(userId, teams, options);

    res.json(result);
  });

  userRoutes.post('/users/:userId/avatar', async (req, res) => {
    const { userId } = framework.validate(
      'parameters',
      req.params,
      paramSchema,
    );

    // user is trying to update someone else
    if (req.loggedUser!.id !== userId) {
      throw Boom.forbidden();
    }

    const payload = framework.validate(
      'payload',
      req.body,
      Joi.object({ avatar: Joi.string().required() }).required(),
    ) as { avatar: string };

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
    const { userId } = framework.validate(
      'parameters',
      req.params,
      paramSchema,
    );

    const update = framework.validate(
      'payload',
      req.body,
      userUpdateSchema,
    ) as UserPatchRequest;

    // user is trying to update someone else
    if (req.loggedUser!.id !== userId) {
      throw Boom.forbidden();
    }

    // user trying to change a team he doesn't belong to
    if (
      update.teams &&
      !update.teams.every(({ id }) =>
        req.loggedUser!.teams.find((t) => t.id === id),
      )
    ) {
      throw Boom.forbidden();
    }

    const result = await userController.update(userId, update);

    res.json(result);
  });

  return userRoutes;
};

const querySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
  search: Joi.string(),
}).required();

const querySchemaWithFilter = querySchema.append({
  filter: Joi.array().items(Joi.string()).single(),
});

const paramSchema = Joi.object({
  userId: Joi.string().required(),
});

const publicParamSchema = Joi.object({
  code: Joi.string().required(),
});

type UserPublicResponse = Pick<UserResponse, 'id' | 'displayName'>;
