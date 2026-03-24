import { Router } from 'express';
import { FetchProjectsFilter, milestoneDiscoveryTeamRoles, milestoneLeadRoles, MilestoneLeadRole } from '@asap-hub/model';
import Boom from '@hapi/boom';
import ProjectController from '../controllers/project.controller';
import {
  validateMilestoneCreateRequest,
  validateProjectFetchParameters,
  validateProjectParameters,
  validateProjectPatchRequest,
} from '../validation/project.validation';

export const projectRouteFactory = (
  projectController: ProjectController,
): Router => {
  const projectRoutes = Router();

  projectRoutes.get('/projects', async (req, res) => {
    const normalizeToStringArray = (value: unknown): string[] | undefined => {
      if (value === undefined) {
        return undefined;
      }
      if (Array.isArray(value)) {
        return value.map((item) => String(item));
      }
      return [String(value)];
    };

    const options = validateProjectFetchParameters({
      ...req.query,
      projectType: normalizeToStringArray(req.query.projectType),
      status: normalizeToStringArray(req.query.status),
      tags: normalizeToStringArray(req.query.tags),
    });

    const projectTypeFilter = options.projectType?.length
      ? options.projectType.length === 1
        ? options.projectType[0]
        : options.projectType
      : undefined;

    const statusFilter = options.status?.length
      ? options.status.length === 1
        ? options.status[0]
        : options.status
      : undefined;

    const filter: FetchProjectsFilter | undefined = (() => {
      const baseFilter: FetchProjectsFilter = {
        ...(projectTypeFilter ? { projectType: projectTypeFilter } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(options.tags && options.tags.length ? { tags: options.tags } : {}),
        ...(options.teamId ? { teamId: options.teamId } : {}),
      };

      return Object.keys(baseFilter).length ? baseFilter : undefined;
    })();

    const { take, skip, search } = options;

    const result = await projectController.fetch({
      take,
      skip,
      search,
      filter,
    });

    res.json(result);
  });

  projectRoutes.get<{ projectId: string }>(
    '/project/:projectId',
    async (req, res) => {
      const { projectId } = validateProjectParameters(req.params);

      const result = await projectController.fetchById(projectId);

      res.json(result);
    },
  );

  projectRoutes.patch<{ projectId: string }>(
    '/project/:projectId',
    async (req, res) => {
      const { projectId } = validateProjectParameters(req.params);
      const { tools } = validateProjectPatchRequest(req.body);

      const project = await projectController.fetchById(projectId);
      const teamId = 'teamId' in project ? project.teamId : undefined;

      if (
        !teamId ||
        !req.loggedInUser?.teams?.find(({ id }) => id === teamId)
      ) {
        throw Boom.forbidden();
      }

      const result = await projectController.update(projectId, tools);

      res.json(result);
    },
  );

  projectRoutes.post<{ projectId: string }>(
    '/project/:projectId/milestones',
    async (req, res) => {
      const { projectId } = validateProjectParameters(req.params);
      const data = validateMilestoneCreateRequest(req.body);

      if (!req.loggedInUser) {
        throw Boom.unauthorized();
      }

      const project = await projectController.fetchById(projectId);

      const isLead = (() => {
        if ('members' in project && project.members) {
          return project.members.some(
            (m) =>
              m.id === req.loggedInUser!.id &&
              milestoneLeadRoles.includes(m.role as MilestoneLeadRole),
          );
        }
        if ('teamId' in project && project.teamId) {
          return !!req.loggedInUser.teams?.find(
            (t) =>
              t.id === project.teamId &&
              (milestoneDiscoveryTeamRoles as readonly string[]).includes(t.role),
          );
        }
        return false;
      })();

      if (!isLead) {
        throw Boom.forbidden();
      }

      const milestoneId = await projectController.createMilestone(
        projectId,
        data,
      );

      res.status(201).json({ id: milestoneId });
    },
  );

  return projectRoutes;
};
