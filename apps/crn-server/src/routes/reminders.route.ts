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
      // we'd not be able to get here without the user logged-in but TS doesn't know that
      /* istanbul ignore next */
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
