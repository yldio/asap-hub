import { framework } from '@asap-hub/services-common';
import Joi from '@hapi/joi';
import { Router } from 'express';
import { EventController } from '../controllers/events';
import { GroupController } from '../controllers/groups';
import { FetchOptions } from '../utils/types';
import { validateEventFetchParameters } from '../validation/event.validation';

export const groupRouteFactory = (
  groupsController: GroupController,
  eventsController: EventController,
): Router => {
  const groupRoutes = Router();

  groupRoutes.get('/groups', async (req, res) => {
    const parameters = req.query;

    const query = framework.validate(
      'query',
      parameters,
      querySchema,
    ) as unknown as FetchOptions;

    const result = await groupsController.fetch(query);

    res.json(result);
  });

  groupRoutes.get<{ groupId: string }>('/groups/:groupId', async (req, res) => {
    const { params } = req;
    const { groupId } = framework.validate('parameters', params, paramSchema);
    const result = await groupsController.fetchById(groupId);

    res.json(result);
  });

  groupRoutes.get('/groups/:groupId/events', async (req, res) => {
    const query = validateEventFetchParameters(req.query);
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
