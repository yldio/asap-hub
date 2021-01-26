import { Router } from 'express';
import { framework } from '@asap-hub/services-common';
import Joi from '@hapi/joi';
import { GroupController, FetchOptions } from '../controllers/groups';

export const teamRouteFactory = (groupsController: GroupController): Router => {
  const groupRoutes = Router();

  groupRoutes.get('/teams/:teamId/groups', async (req, res) => {
    const { query } = req;
    const { params } = req;

    const { teamId } = framework.validate('parameters', params, paramSchema);
    const options = (framework.validate(
      'query',
      query,
      querySchema,
    ) as unknown) as FetchOptions;

    const result = await groupsController.fetchByTeamId(teamId, options);

    res.json(result);
  });

  return groupRoutes;
};

const querySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
  search: Joi.string(),
}).required();

const paramSchema = Joi.object({
  teamId: Joi.string().required(),
});
