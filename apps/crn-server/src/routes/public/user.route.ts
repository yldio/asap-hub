import { NotFoundError } from '@asap-hub/errors';
import {
  ListPublicUserResponse,
  PublicUserResponse,
  UserResponse,
} from '@asap-hub/model';
import { validateFetchPaginationOptions } from '@asap-hub/server-common';
import Boom from '@hapi/boom';
import { Response, Router } from 'express';

import UserController from '../../controllers/user.controller';

export const userRouteFactory = (userController: UserController): Router => {
  const userRoutes = Router();

  userRoutes.get(
    '/users',
    async (req, res: Response<ListPublicUserResponse>) => {
      const { query } = req;

      const options = validateFetchPaginationOptions(query);

      if (options.take && options.take > 100) {
        throw Boom.badRequest('take must be less than or equal to 100');
      }

      const result = await userController.fetchPublicUsers({
        ...options,
      });

      res.json({
        total: result.total,
        items: result.items,
      });
    },
  );

  userRoutes.get(
    '/users/:userId',
    async (req, res: Response<PublicUserResponse>) => {
      const { userId } = req.params;

      const user = await userController.fetchById(userId, true);

      if (user.onboarded === false) {
        throw new NotFoundError(undefined, `user with id ${userId} not found`);
      }

      res.json(mapUserToPublicUser(user));
    },
  );

  return userRoutes;
};

const mapUserToPublicUser = (user: UserResponse): PublicUserResponse => ({
  avatarUrl: user.avatarUrl,
  biography: user.biography,
  city: user.city,
  country: user.country,
  createdDate: user.createdDate,
  lastModifiedDate: user.lastModifiedDate,
  degree: user.degree,
  firstName: user.firstName,
  lastName: user.lastName,
  alumni: user.alumniSinceDate ? 'Yes' : 'No',
  id: user.id,
  institution: user.institution,
  interestGroups: user.interestGroups.map((ig) => ({
    name: ig.name,
    role: ig.role,
  })),
  labs: user.labs,
  researchTheme: user.researchTheme,
  researchOutputs: user.researchOutputs || [],
  tags: user.tags?.map((tag) => tag.name) || [],
  teams: user.teams?.map((team) => ({
    displayName: team.displayName ?? '',
    role: team.role,
  })),
  workingGroups: user.workingGroups
    .filter((wg) => wg.active)
    .map((wg) => ({
      name: wg.name,
      role: wg.role,
    })),
  ...user.social,
});
