import { EventResponse, ListEventResponse } from '@asap-hub/model';
import { EventController } from '@asap-hub/server-common';
import { Response, Router } from 'express';
import {
  validateEventFetchParameters,
  validateEventParameters,
} from '../validation/event.validation';

export const eventRouteFactory = (eventController: EventController): Router => {
  const eventRoutes = Router();

  eventRoutes.get('/events', async (req, res: Response<ListEventResponse>) => {
    const query = validateEventFetchParameters(req.query);
    const result = await eventController.fetch(query);

    res.json(result);
  });

  eventRoutes.get<{ eventId: string }>(
    '/events/:eventId',
    async (req, res: Response<EventResponse>) => {
      const { params } = req;
      const { eventId } = validateEventParameters(params);
      const result = await eventController.fetchById(eventId);

      res.json(result);
    },
  );

  return eventRoutes;
};
