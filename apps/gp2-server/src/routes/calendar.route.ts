import { gp2 } from '@asap-hub/model';
import { Router } from 'express';

export const calendarRouteFactory = (
  calendarController: gp2.CalendarController,
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
