import { Router } from 'express';
import { GroupController, FetchOptions } from '../controllers/groups';
import Joi from '@hapi/joi';
import { framework } from '@asap-hub/services-common';

export const groupRouteFactory = (
  groupsController: GroupController,
): Router => {
  const groupRoutes = Router();

  groupRoutes.get('/groups', async (req, res) => {
    const parameters = req.query;

    const query = (framework.validate(
      'query',
      parameters,
      querySchema,
    ) as unknown) as FetchOptions;

    const result = await groupsController.fetch(query);

    res.json(result);
  });

  return groupRoutes;
};

const querySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
  search: Joi.string(),
}).required();
