import {
  ListPublicUserResponse,
  PublicUserResponse,
  UserResponse,
} from '@asap-hub/model';
import { validateFetchPaginationOptions } from '@asap-hub/server-common';
import { Response, Router } from 'express';
import UserController from '../../controllers/user.controller';

export const userRouteFactory = (userController: UserController): Router => {
  const userRoutes = Router();

  userRoutes.get(
    '/users',
    async (req, res: Response<ListPublicUserResponse>) => {
      const { query } = req;

      const options = validateFetchPaginationOptions(query);

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

      const user = await userController.fetchById(userId);

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
  degree: user.degree,
  firstName: user.firstName,
  id: user.id,
  labs: user.labs,
  lastName: user.lastName,
  lastModifiedDate: user.lastModifiedDate,
  institution: user.institution,
  createdDate: user.createdDate,
  tags: user.tags?.map((tag) => tag.name) || [],
  teams: user.teams?.map((team) => ({
    displayName: team.displayName ?? '',
    role: team.role,
  })),
  workingGroups: user.workingGroups.map((wg) => ({
    name: wg.name,
    role: wg.role,
  })),
  interestGroups: user.interestGroups.map((ig) => ({
    name: ig.name,
  })),
  researchOutputs: user.researchOutputs || [],
});
