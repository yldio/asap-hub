import { Router, Response } from 'express';
import { framework } from '@asap-hub/services-common';
import Joi from '@hapi/joi';
import { ListEventResponse, EventResponse } from '@asap-hub/model';
import { EventController, FetchEventsOptions } from '../controllers/events';

export const eventRouteFactory = (eventController: EventController): Router => {
  const eventRoutes = Router();

  eventRoutes.get('/events', async (req, res: Response<ListEventResponse>) => {
    const query = (framework.validate(
      'query',
      req.query,
      eventQuerySchema,
    ) as unknown) as FetchEventsOptions;

    const result = await eventController.fetch(query);

    res.json({
      total: result.total,
      items: result.items.map((item) => ({
        ...item,
        groups: [],
      })),
    });
  });

  eventRoutes.get(
    '/events/:eventId',
    async (req, res: Response<EventResponse>) => {
      const { params } = req;
      const { eventId } = framework.validate('parameters', params, paramSchema);

      const result = await eventController.fetchById(eventId);

      res.json({
        ...result,
        groups: [],
      });
    },
  );

  return eventRoutes;
};

const paramSchema = Joi.object({
  eventId: Joi.string().required(),
});

const querySchemaBase = {
  take: Joi.number(),
  skip: Joi.number(),
  search: Joi.string(),
  sortBy: Joi.string().valid('startDate', 'endDate').default('startDate'),
  sortOrder: Joi.string().valid('asc', 'desc').default('asc'),
};

export const eventQuerySchema = Joi.object({
  before: Joi.date().iso().raw(),
  after: Joi.date().iso().raw(),
})
  .or('before', 'after')
  .append(querySchemaBase);
