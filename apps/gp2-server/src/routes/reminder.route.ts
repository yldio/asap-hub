import { DateTime } from 'luxon';
import Boom from '@hapi/boom';
import { gp2 as gp2Model } from '@asap-hub/model';
import { Response, Router } from 'express';
import ReminderController from '../controllers/reminder.controller';
import { validateReminderParameters } from '../validation/reminder.validation';

export const reminderRouteFactory = (
  reminderController: ReminderController,
): Router => {
  const reminderRoutes = Router();

  reminderRoutes.get(
    '/reminders',
    async (req, res: Response<gp2Model.ListReminderResponse>) => {
      // we'd not be able to get here without the user logged-in but TS doesn't know that
      /* istanbul ignore next */
      if (!req.loggedInUser) {
        throw Boom.forbidden();
      }

      const parameters = req.query;
      const { timezone } = validateReminderParameters(parameters);

      if (!DateTime.local().setZone(timezone).isValid) {
        throw Boom.badRequest('Validation error', {
          details: `Invalid timezone specified ${timezone}`,
        });
      }

      const result = await reminderController.fetch({
        userId: req.loggedInUser.id,
        timezone,
      });

      res.json(result);
    },
  );

  return reminderRoutes;
};
