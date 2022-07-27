import { ListReminderResponse } from '@asap-hub/model';
import { Response, Router } from 'express';

export const reminderRouteFactory = (): Router => {
  const reminderRoutes = Router();

  reminderRoutes.get(
    '/reminders',
    async (req, res: Response<ListReminderResponse>) => {
      res.json({
        items: [],
        total: 0,
      });
    },
  );

  return reminderRoutes;
};
