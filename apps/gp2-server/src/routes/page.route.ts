import { Router } from 'express';
import PageController from '../controllers/page.controller';

export const pageRouteFactory = (pageController: PageController): Router => {
  const pageRoutes = Router();

  pageRoutes.get('/pages/:path', async (req, res) => {
    const { params } = req;

    const result = await pageController.fetchByPath(`/${params.path}`);

    res.json(result);
  });

  return pageRoutes;
};
