import { Router, Response } from 'express';
import { gp2 as gp2Model } from '@asap-hub/model';
import WorkingGroupController from '../../controllers/working-group.controller';

export const workingGroupRouteFactory = (
  workingGroupController: WorkingGroupController,
): Router => {
  const workingGroupRoutes = Router();

  workingGroupRoutes.get(
    '/working-groups',
    async (_req, res: Response<gp2Model.ListPublicWorkingGroupResponse>) => {
      const result = await workingGroupController.fetch();

      res.json({
        total: result.total,
        items: result.items.map(mapWorkingGroupToPublicWorkingGroup),
      });
    },
  );

  workingGroupRoutes.get(
    '/working-groups/:workingGroupId',
    async (req, res: Response<gp2Model.PublicWorkingGroupResponse>) => {
      const { workingGroupId } = req.params;

      const workingGroup =
        await workingGroupController.fetchById(workingGroupId);

      res.json(mapWorkingGroupToPublicWorkingGroup(workingGroup));
    },
  );

  return workingGroupRoutes;
};

const mapWorkingGroupToPublicWorkingGroup = (
  workingGroup: gp2Model.WorkingGroupResponse,
): gp2Model.PublicWorkingGroupResponse => ({
  description: workingGroup.description,
  id: workingGroup.id,
  lastModifiedDate: workingGroup.publishDate,
  members: workingGroup.members,
  primaryEmail: workingGroup.primaryEmail,
  publishDate: workingGroup.publishDate,
  secondaryEmail: workingGroup.secondaryEmail,
  shortDescription: workingGroup.shortDescription,
  systemPublishedVersion: workingGroup.systemPublishedVersion,
  title: workingGroup.title,
});
