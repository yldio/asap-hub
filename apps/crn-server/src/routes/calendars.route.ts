import { Router } from 'express';
import { CalendarController } from '../controllers/calendars';

export const calendarRouteFactory = (
  calendarController: CalendarController,
): Router => {
  const calendarRoutes = Router();

  calendarRoutes.get('/calendars', async (_req, res) => {
    const result = await calendarController.fetch();

    res.json(result);
  });

  return calendarRoutes;
};
