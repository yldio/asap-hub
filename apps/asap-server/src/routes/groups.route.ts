import { Router } from 'express';
import { framework } from '@asap-hub/services-common';
import Joi from '@hapi/joi';
import { GroupController } from '../controllers/groups';
import { FetchOptions } from '../utils/types';
import { FetchEventsOptions, EventController } from '../controllers/events';
import { eventQuerySchema } from './events.route';

export const groupRouteFactory = (
  groupsController: GroupController,
  eventsController: EventController,
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

  groupRoutes.get('/groups/:groupId', async (req, res) => {
    const { params } = req;
    const { groupId } = framework.validate('parameters', params, paramSchema);

    const result = await groupsController.fetchById(groupId);

    res.json(result);
  });

  groupRoutes.get('/groups/:groupId/events', async (req, res) => {
    const query = (framework.validate(
      'query',
      req.query,
      eventQuerySchema,
    ) as unknown) as FetchEventsOptions;
    const { params } = req;
    const { groupId } = framework.validate('parameters', params, paramSchema);

    const result = await eventsController.fetch({ groupId, ...query });

    res.json(result);
  });

  return groupRoutes;
};

const paramSchema = Joi.object({
  groupId: Joi.string().required(),
});

const querySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
  search: Joi.string(),
}).required();
