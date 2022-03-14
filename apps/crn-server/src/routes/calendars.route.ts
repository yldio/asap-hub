import { Router } from 'express';
import { CalendarController } from '../controllers/calendars';
import { validateFetchPaginationOptions } from '../validation';

export const calendarRouteFactory = (
  calendarController: CalendarController,
): Router => {
  const calendarRoutes = Router();

  calendarRoutes.get('/calendars', async (req, res) => {
    const parameters = req.query;

    const query = validateFetchPaginationOptions(parameters);

    const result = await calendarController.fetch(query);

    res.json(result);
  });

  return calendarRoutes;
};
