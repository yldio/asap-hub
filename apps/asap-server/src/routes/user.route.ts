import { Router } from 'express';
import { framework } from '@asap-hub/services-common';
import Joi from '@hapi/joi';
import { GroupController } from '../controllers/groups';
import { FetchOptions } from '../utils/types';

export const userRouteFactory = (groupsController: GroupController): Router => {
  const userRoutes = Router();

  userRoutes.get('/user/:userId/groups', async (req, res) => {
    const { query } = req;
    const { params } = req;

    const { userId } = framework.validate('parameters', params, paramSchema);
    const options = (framework.validate(
      'query',
      query,
      querySchema,
    ) as unknown) as FetchOptions;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const teams = req.loggedUser!.teams.map(({ id }) => id);

    const result = await groupsController.fetchByUserId(userId, teams, options);

    res.json(result);
  });

  return userRoutes;
};

const querySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
  search: Joi.string(),
}).required();

const paramSchema = Joi.object({
  userId: Joi.string().required(),
});
