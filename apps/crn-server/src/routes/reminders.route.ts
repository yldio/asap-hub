import Boom from '@hapi/boom';
import { ListReminderResponse } from '@asap-hub/model';
import { Response, Router } from 'express';
import { ReminderController } from '../controllers/reminders';

export const reminderRouteFactory = (
  reminderController: ReminderController,
): Router => {
  const reminderRoutes = Router();

  reminderRoutes.get(
    '/reminders',
    async (req, res: Response<ListReminderResponse>) => {
      if (!req.loggedInUser) {
        throw Boom.forbidden();
      }

      const result = await reminderController.fetch({
        userId: req.loggedInUser.id,
      });

      res.json(result);
    },
  );

  return reminderRoutes;
};
