import { validateFetchOptions } from '@asap-hub/server-common';
import { Router } from 'express';
import CategoryController from '../controllers/category.controller';

export const categoryRouteFactory = (
  categoryController: CategoryController,
): Router => {
  const categoryRoutes = Router();

  categoryRoutes.get('/categories', async (req, res) => {
    const { query } = req;

    const options = validateFetchOptions(query);

    const result = await categoryController.fetch(options);

    res.json(result);
  });

  return categoryRoutes;
};
