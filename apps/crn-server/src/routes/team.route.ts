/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ListInterestGroupResponse,
  ListTeamResponse,
  TeamResponse,
} from '@asap-hub/model';
import { validateFetchOptions } from '@asap-hub/server-common';
import Boom from '@hapi/boom';
import { Response, Router } from 'express';
import InterestGroupController from '../controllers/interest-group.controller';
import TeamController from '../controllers/team.controller';
import {
  validateTeamParameters,
  validateTeamPatchRequest,
} from '../validation/team.validation';

export const teamRouteFactory = (
  interestGroupController: InterestGroupController,
  teamController: TeamController,
): Router => {
  const teamRoutes = Router();

  teamRoutes.get('/teams', async (req, res: Response<ListTeamResponse>) => {
    const { query } = req;

    const options = validateFetchOptions(query);

    const result = await teamController.fetch(options);

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

      const internalAPI = true;

      const result = await teamController.fetchById(teamId, {
        showTools,
        internalAPI,
      });

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

      const result = await teamController.update(teamId, tools);

      res.json(result);
    },
  );

  teamRoutes.get<{ teamId: string }>(
    '/teams/:teamId/interest-groups',
    async (req, res: Response<ListInterestGroupResponse>) => {
      const { params } = req;
      const { teamId } = validateTeamParameters(params);

      const result = await interestGroupController.fetchByTeamId(teamId);

      res.json(result);
    },
  );

  return teamRoutes;
};
