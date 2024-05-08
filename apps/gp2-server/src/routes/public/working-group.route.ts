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
  id: workingGroup.id,
  description: workingGroup.description,
  members: workingGroup.members,
  shortDescription: workingGroup.shortDescription,
  title: workingGroup.title,
  primaryEmail: workingGroup.primaryEmail,
  secondaryEmail: workingGroup.secondaryEmail,
});
