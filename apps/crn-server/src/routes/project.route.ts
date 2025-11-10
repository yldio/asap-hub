import { Router } from 'express';
import { FetchProjectsFilter } from '@asap-hub/model';
import ProjectController from '../controllers/project.controller';
import {
  validateProjectFetchParameters,
  validateProjectParameters,
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

  return projectRoutes;
};
