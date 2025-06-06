import {
  ListPublicWorkingGroupListResponse,
  PublicWorkingGroupListResponse,
  PublicWorkingGroupResponse,
  WorkingGroupResponse,
} from '@asap-hub/model';
import { validateFetchPaginationOptions } from '@asap-hub/server-common';
import { Response, Router } from 'express';
import WorkingGroupController from '../../controllers/working-group.controller';

export const workingGroupRouteFactory = (
  workingGroupController: WorkingGroupController,
): Router => {
  const workingGroupRoutes = Router();

  workingGroupRoutes.get(
    '/working-groups',
    async (req, res: Response<ListPublicWorkingGroupListResponse>) => {
      const { query } = req;

      const options = validateFetchPaginationOptions(query);

      const result = await workingGroupController.fetch({
        ...options,
      });

      res.json({
        total: result.total,
        items: result.items.map(mapToPublicWorkingGroupList),
      });
    },
  );

  workingGroupRoutes.get(
    '/working-groups/:workingGroupId',
    async (req, res: Response<PublicWorkingGroupResponse>) => {
      const { workingGroupId } = req.params;

      const publicAPI = true;
      const workingGroup = await workingGroupController.fetchById(
        workingGroupId,
        publicAPI,
      );

      res.json(mapToPublicWorkingGroup(workingGroup));
    },
  );

  return workingGroupRoutes;
};

const mapToPublicWorkingGroupList = (
  workingGroup: WorkingGroupResponse,
): PublicWorkingGroupListResponse => {
  const { id, title, description, shortText, leaders } = workingGroup;

  return {
    id,
    title,
    description,
    shortDescription: shortText,
    members: leaders.map((leader) => ({
      id: leader.user.id,
      role: leader.role,
      firstName: leader.user.firstName,
      lastName: leader.user.lastName,
      displayName: leader.user.displayName,
      avatarUrl: leader.user.avatarUrl,
    })),
  };
};

const mapToPublicWorkingGroup = (
  workingGroup: WorkingGroupResponse,
): PublicWorkingGroupResponse => {
  const {
    id,
    title,
    description,
    shortText,
    deliverables,
    tags,
    researchOutputsIds,
  } = workingGroup;

  return {
    id,
    title,
    description,
    shortDescription: shortText,
    deliverables,
    tags,
    members: [
      ...workingGroup.leaders.map((member) => ({
        id: member.user.id,
        firstName: member.user.firstName,
        lastName: member.user.lastName,
        displayName: member.user.displayName,
        avatarUrl: member.user.avatarUrl,
        role: member.role,
      })),
      ...workingGroup.members.map((member) => ({
        id: member.user.id,
        firstName: member.user.firstName,
        lastName: member.user.lastName,
        displayName: member.user.displayName,
        avatarUrl: member.user.avatarUrl,
      })),
    ],
    researchOutputsIds,
  };
};
