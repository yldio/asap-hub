import { ListResourceTypeResponse } from '@asap-hub/model';
import { Response, Router } from 'express';
import ResourceTypeController from '../controllers/resource-type.controller';

export const resourceTypeRouteFactory = (
  resourceTypeController: ResourceTypeController,
): Router => {
  const resourceTypesRoutes = Router();

  resourceTypesRoutes.get(
    '/resource-types',
    async (_req, res: Response<ListResourceTypeResponse>) => {
      const result = await resourceTypeController.fetch();
      res.json(result);
    },
  );

  return resourceTypesRoutes;
};
