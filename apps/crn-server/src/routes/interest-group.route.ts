import { EventController } from '@asap-hub/model';
import { validateFetchOptions } from '@asap-hub/server-common';
import { Router } from 'express';
import InterestGroupController from '../controllers/interest-group.controller';
import { validateEventFetchParameters } from '../validation/event.validation';
import { validateInterestGroupParameters } from '../validation/interest-group.validation';

export const interestGroupRouteFactory = (
  interestGroupController: InterestGroupController,
  eventController: EventController,
): Router => {
  const interestGroupRoutes = Router();

  interestGroupRoutes.get('/interest-groups', async (req, res) => {
    const parameters = req.query;

    const query = validateFetchOptions(parameters);

    const result = await interestGroupController.fetch(query);

    res.json(result);
  });

  interestGroupRoutes.get<{ groupId: string }>(
    '/interest-groups/:groupId',
    async (req, res) => {
      const { params } = req;
      const { groupId } = validateInterestGroupParameters(params);
      const result = await interestGroupController.fetchById(groupId);

      res.json(result);
    },
  );

  interestGroupRoutes.get(
    '/interest-groups/:groupId/events',
    async (req, res) => {
      const query = validateEventFetchParameters(req.query);
      const { params } = req;
      const { groupId } = validateInterestGroupParameters(params);

      const result = await eventController.fetch({
        filter: { interestGroupId: groupId },
        ...query,
      });

      res.json(result);
    },
  );

  return interestGroupRoutes;
};
