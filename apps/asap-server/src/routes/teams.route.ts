/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ListGroupResponse,
  ListTeamResponse,
  TeamPatchRequest,
  TeamResponse,
} from '@asap-hub/model';
import { framework } from '@asap-hub/services-common';
import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import { Response, Router } from 'express';
import { GroupController } from '../controllers/groups';
import { FetchTeamsOptions, TeamController } from '../controllers/teams';
import { teamUpdateSchema } from '../entities/team';
import { FetchOptions } from '../utils/types';

export const teamRouteFactory = (
  groupsController: GroupController,
  teamsController: TeamController,
): Router => {
  const teamRoutes = Router();

  teamRoutes.get('/teams', async (req, res: Response<ListTeamResponse>) => {
    const { query } = req;

    const options = framework.validate(
      'query',
      query,
      fetchQuerySchema,
    ) as FetchTeamsOptions;

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
      const { teamId } = framework.validate('parameters', params, paramSchema);

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

      const { teamId } = framework.validate('parameters', params, paramSchema);
      const { tools } = framework.validate(
        'payload',
        body,
        teamUpdateSchema,
      ) as TeamPatchRequest;

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
      const { teamId } = framework.validate('parameters', params, paramSchema);
      const options = framework.validate(
        'query',
        query,
        querySchema,
      ) as FetchOptions;

      const result = await groupsController.fetchByTeamId(teamId, options);

      res.json(result);
    },
  );

  return teamRoutes;
};

const querySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
  search: Joi.string(),
}).required();

const paramSchema = Joi.object({
  teamId: Joi.string().required(),
});

const fetchQuerySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
  search: Joi.string(),
  filter: Joi.array().items(Joi.string()).single(),
}).required();
