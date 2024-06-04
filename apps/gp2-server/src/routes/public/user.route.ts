import { Router, Response } from 'express';
import { gp2 as gp2Model } from '@asap-hub/model';
import { validateFetchPaginationOptions } from '@asap-hub/server-common';
import UserController from '../../controllers/user.controller';

export const userRouteFactory = (userController: UserController): Router => {
  const userRoutes = Router();

  userRoutes.get(
    '/users',
    async (req, res: Response<gp2Model.ListPublicUserResponse>) => {
      const { query } = req;

      const options = validateFetchPaginationOptions(query);

      const result = await userController.fetch(options);

      res.json({
        total: result.total,
        items: result.items.map(mapUserToPublicUser),
      });
    },
  );

  userRoutes.get(
    '/users/:userId',
    async (req, res: Response<gp2Model.PublicUserResponse>) => {
      const { userId } = req.params;

      const output = await userController.fetchById(userId);

      res.json(mapUserToPublicUser(output));
    },
  );

  return userRoutes;
};

const mapUserToPublicUser = (
  user: gp2Model.UserResponse,
): gp2Model.PublicUserResponse => ({
  avatarUrl: user.avatarUrl,
  biography: user.biography,
  city: user.city,
  country: user.country,
  degrees: user.degrees,
  displayName: user.displayName,
  firstName: user.firstName,
  id: user.id,
  lastName: user.lastName,
  middleName: user.middleName,
  institution: user.positions[0]?.institution,
  title: user.positions[0]?.role,
  outputs: user.outputs.filter(filterOutputs).map((output) => ({
    id: output.id,
    title: output.title,
    shortDescription: output.shortDescription,
    sharingStatus: output.sharingStatus,
    gp2Supported: output.gp2Supported,
  })),
  publishDate: user.createdDate,
  systemPublishedVersion: user.systemPublishedVersion,
  workingGroups: user.workingGroups.map((workingGroup) => ({
    id: workingGroup.id,
    title: workingGroup.title,
    role: workingGroup.role,
  })),
});

// filter public and gp2Supported outputs only
const filterOutputs = (output: gp2Model.UserOutput): boolean =>
  output.sharingStatus === 'Public' && output.gp2Supported === 'Yes';
