/* istanbul ignore file */
import { gp2 } from '@asap-hub/model';
import { Router } from 'express';
import {
  validateEventFetchParameters,
  validateEventParameters,
} from '../validation/event.validation';

export const eventRouteFactory = (
  eventController: gp2.EventController,
): Router => {
  const eventRoutes = Router();

  eventRoutes.get<gp2.EventConstraint, gp2.ListEventResponse>(
    '/events',
    async (req, res) => {
      const query = validateEventFetchParameters(req.query);
      const result = await eventController.fetch(query);

      res.json(result);
    },
  );

  eventRoutes.get<{ eventId: string }, gp2.EventResponse>(
    '/events/:eventId',
    async (req, res) => {
      const { params } = req;
      const { eventId } = validateEventParameters(params);
      const result = await eventController.fetchById(eventId);

      res.json(result);
    },
  );

  return eventRoutes;
};
