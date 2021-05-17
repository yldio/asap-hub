/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Router } from 'express';
import { framework } from '@asap-hub/services-common';
import Joi from '@hapi/joi';
import Boom from '@hapi/boom';
import { TeamPatchRequest } from '@asap-hub/model';

import { TeamController } from '../controllers/teams';
import { teamUpdateSchema } from '../entities/team';
import { GroupController } from '../controllers/groups';
import { FetchOptions } from '../utils/types';

export const teamRouteFactory = (
  groupsController: GroupController,
  teamsController: TeamController,
): Router => {
  const teamRoutes = Router();

  teamRoutes.get('/teams', async (req, res) => {
    const { query } = req;

    const options = framework.validate(
      'query',
      query,
      fetchQuerySchema,
    ) as unknown as {
      take: number;
      skip: number;
      search?: string;
      filter?: string[] | string;
    };

    const result = await teamsController.fetch(options, req.loggedUser!);

    res.json(result);
  });

  teamRoutes.get('/teams/:teamId', async (req, res) => {
    const { params } = req;
    const { teamId } = framework.validate('parameters', params, paramSchema);

    const result = await teamsController.fetchById(teamId, req.loggedUser!);

    res.json(result);
  });

  teamRoutes.patch('/teams/:teamId', async (req, res) => {
    const { body, params } = req;

    const { teamId } = framework.validate('parameters', params, paramSchema);
    const { tools } = framework.validate(
      'payload',
      body,
      teamUpdateSchema,
    ) as TeamPatchRequest;

    if (!req.loggedUser!.teams.find(({ id }) => id === teamId)) {
      throw Boom.forbidden();
    }

    const result = await teamsController.update(teamId, tools, req.loggedUser!);

    res.json(result);
  });

  teamRoutes.get('/teams/:teamId/groups', async (req, res) => {
    const { query, params } = req;

    const { teamId } = framework.validate('parameters', params, paramSchema);
    const options = framework.validate(
      'query',
      query,
      querySchema,
    ) as unknown as FetchOptions;

    const result = await groupsController.fetchByTeamId(teamId, options);

    res.json(result);
  });

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
