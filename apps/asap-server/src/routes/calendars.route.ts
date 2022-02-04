import { Router } from 'express';
import { framework } from '@asap-hub/services-common';
import Joi from '@hapi/joi';
import { CalendarController } from '../controllers/calendars';

export const calendarRouteFactory = (
  calendarController: CalendarController,
): Router => {
  const calendarRoutes = Router();

  calendarRoutes.get('/calendars', async (req, res) => {
    const parameters = req.query;

    const query = framework.validate('query', parameters, querySchema);

    const result = await calendarController.fetch(query);

    res.json(result);
  });

  return calendarRoutes;
};

const querySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
}).required();
