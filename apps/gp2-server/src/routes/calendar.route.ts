import { gp2 } from '@asap-hub/model';
import { Router } from 'express';
import { CalendarController } from '../controllers/calendar.controller';

export const calendarRouteFactory = (
  calendarController: CalendarController,
): Router => {
  const calendarRoutes = Router();

  calendarRoutes.get<unknown, gp2.ListCalendarResponse>(
    '/calendars',
    async (_req, res) => {
      const result = await calendarController.fetch();

      res.json(result);
    },
  );

  return calendarRoutes;
};
