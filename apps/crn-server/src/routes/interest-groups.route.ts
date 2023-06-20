import { EventController } from '@asap-hub/model';
import { validateFetchOptions } from '@asap-hub/server-common';
import { Router } from 'express';
import { InterestGroupController } from '../controllers/interest-groups.controller';
import { validateEventFetchParameters } from '../validation/event.validation';
import { validateGroupParameters } from '../validation/group.validation';

export const interestGroupRouteFactory = (
  groupsController: InterestGroupController,
  eventsController: EventController,
): Router => {
  const interestGroupRoutes = Router();

  interestGroupRoutes.get('/groups', async (req, res) => {
    const parameters = req.query;

    const query = validateFetchOptions(parameters);

    const result = await groupsController.fetch(query);

    res.json(result);
  });

  interestGroupRoutes.get<{ groupId: string }>(
    '/groups/:groupId',
    async (req, res) => {
      const { params } = req;
      const { groupId } = validateGroupParameters(params);
      const result = await groupsController.fetchById(groupId);

      res.json(result);
    },
  );

  interestGroupRoutes.get('/groups/:groupId/events', async (req, res) => {
    const query = validateEventFetchParameters(req.query);
    const { params } = req;
    const { groupId } = validateGroupParameters(params);

    const result = await eventsController.fetch({
      filter: { groupId },
      ...query,
    });

    res.json(result);
  });

  return interestGroupRoutes;
};
