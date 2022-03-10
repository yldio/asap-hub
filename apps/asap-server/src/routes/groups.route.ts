import { Router } from 'express';
import { EventController } from '../controllers/events';
import { GroupController } from '../controllers/groups';
import { validateFetchOptions } from '../validation';
import { validateEventFetchParameters } from '../validation/event.validation';
import { validateGroupParameters } from '../validation/group.validation';

export const groupRouteFactory = (
  groupsController: GroupController,
  eventsController: EventController,
): Router => {
  const groupRoutes = Router();

  groupRoutes.get('/groups', async (req, res) => {
    const parameters = req.query;

    const query = validateFetchOptions(parameters);

    const result = await groupsController.fetch(query);

    res.json(result);
  });

  groupRoutes.get<{ groupId: string }>('/groups/:groupId', async (req, res) => {
    const { params } = req;
    const { groupId } = validateGroupParameters(params);
    const result = await groupsController.fetchById(groupId);

    res.json(result);
  });

  groupRoutes.get('/groups/:groupId/events', async (req, res) => {
    const query = validateEventFetchParameters(req.query);
    const { params } = req;
    const { groupId } = validateGroupParameters(params);

    const result = await eventsController.fetch({ groupId, ...query });

    res.json(result);
  });

  return groupRoutes;
};
