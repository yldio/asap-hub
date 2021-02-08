import { Router } from 'express';
import { framework } from '@asap-hub/services-common';
import Joi from '@hapi/joi';
import { EventController, FetchEventsOptions } from '../controllers/events';

export const eventRouteFactory = (eventController: EventController): Router => {
  const eventRoutes = Router();

  eventRoutes.get('/events', async (req, res) => {
    const query = (framework.validate(
      'query',
      req.query,
      querySchema,
    ) as unknown) as FetchEventsOptions;

    const result = await eventController.fetch(query);
    res.json(result);
  });

  return eventRoutes;
};

const querySchemaBase = {
  take: Joi.number(),
  skip: Joi.number(),
};

const querySchema = Joi.object({
  before: Joi.date().iso().raw(),
  after: Joi.date().iso().raw(),
})
  .or('before', 'after')
  .append(querySchemaBase);
