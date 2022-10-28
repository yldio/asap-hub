import type { gp2 } from '@asap-hub/model';
import { Router } from 'express';
import { WorkingGroupController } from '../controllers/working-group.controller';
import {
  validateWorkingGroupParameters,
  validateWorkingGroupPatchRequest,
} from '../validation/working-group.validation';

export const workingGroupRouteFactory = (
  workingGroupController: WorkingGroupController,
): Router => {
  const workingGroupRoutes = Router();

  workingGroupRoutes.get<unknown, gp2.ListWorkingGroupResponse>(
    '/working-groups',
    async (req, res) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const loggedInUserId = req.loggedInUser!.id;
      const workingGroups = await workingGroupController.fetch(loggedInUserId);

      res.json(workingGroups);
    },
  );

  workingGroupRoutes.get<{ workingGroupId: string }, gp2.WorkingGroupResponse>(
    '/working-group/:workingGroupId',
    async (req, res) => {
      const { params } = req;

      const { workingGroupId } = validateWorkingGroupParameters(params);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const loggedInUserId = req.loggedInUser!.id;
      const workingGroup = await workingGroupController.fetchById(
        workingGroupId,
        loggedInUserId,
      );

      res.json(workingGroup);
    },
  );

  type WorkingGroupResourceRequest = NonNullable<
    gp2.WorkingGroupResponse['resources']
  >;
  workingGroupRoutes.put<
    { workingGroupId: string },
    gp2.WorkingGroupResponse,
    WorkingGroupResourceRequest
  >('/working-group/:workingGroupId/resources', async (req, res) => {
    const { params, body: resources } = req;

    const { workingGroupId } = validateWorkingGroupParameters(params);
    validateWorkingGroupPatchRequest(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resources as Record<string, any>,
    );

    // check resources are resources

    // check user is admin

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const loggedInUserId = req.loggedInUser!.id;
    const workingGroup = await workingGroupController.update(
      workingGroupId,
      { resources },
      loggedInUserId,
    );

    res.json(workingGroup);
  });
  return workingGroupRoutes;
};
