import { gp2 } from '@asap-hub/model';
import { EventController } from '@asap-hub/server-common';
import { Router } from 'express';
import {
  validateEventFetchParameters,
  validateEventParameters,
} from '../validation/event.validation';

export const eventRouteFactory = (
  eventController: EventController<
    gp2.EventResponse,
    gp2.ListEventResponse,
    gp2.EventCreateRequest,
    gp2.EventUpdateRequest
  >,
): Router => {
  const eventRoutes = Router();

  eventRoutes.get<unknown, gp2.ListEventResponse>(
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
