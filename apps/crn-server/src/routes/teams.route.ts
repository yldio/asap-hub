/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ListGroupResponse,
  ListTeamResponse,
  TeamResponse,
} from '@asap-hub/model';
import { validateFetchOptions } from '@asap-hub/server-common';
import Boom from '@hapi/boom';
import { Response, Router } from 'express';
import { GroupController } from '../controllers/groups';
import { TeamController } from '../controllers/teams';
import {
  validateTeamParameters,
  validateTeamPatchRequest,
} from '../validation/team.validation';

export const teamRouteFactory = (
  groupsController: GroupController,
  teamsController: TeamController,
): Router => {
  const teamRoutes = Router();

  teamRoutes.get('/teams', async (req, res: Response<ListTeamResponse>) => {
    const { query } = req;

    const options = validateFetchOptions(query);

    const result = await teamsController.fetch({
      ...options,
      showTeamTools: req.loggedInUser?.teams.map((team) => team.id),
    });

    res.json(result);
  });

  teamRoutes.get<{ teamId: string }>(
    '/teams/:teamId',
    async (req, res: Response<TeamResponse>) => {
      const { params } = req;
      const { teamId } = validateTeamParameters(params);

      const showTools = !!req.loggedInUser?.teams.find(
        (team) => team.id === teamId,
      );

      const result = await teamsController.fetchById(teamId, { showTools });

      res.json(result);
    },
  );

  teamRoutes.patch<{ teamId: string }>(
    '/teams/:teamId',
    async (req, res: Response<TeamResponse>) => {
      const { body, params } = req;

      const { teamId } = validateTeamParameters(params);
      const { tools } = validateTeamPatchRequest(body);

      if (!req.loggedInUser!.teams.find(({ id }) => id === teamId)) {
        throw Boom.forbidden();
      }

      const result = await teamsController.update(teamId, tools);

      res.json(result);
    },
  );

  teamRoutes.get<{ teamId: string }>(
    '/teams/:teamId/groups',
    async (req, res: Response<ListGroupResponse>) => {
      const { query, params } = req;
      const { teamId } = validateTeamParameters(params);
      const options = validateFetchOptions(query);

      const result = await groupsController.fetchByTeamId(teamId, options);

      res.json(result);
    },
  );

  return teamRoutes;
};
