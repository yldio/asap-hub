import { Router } from 'express';
import { PageController } from '../controllers/pages';

export const pageRouteFactory = (pageController: PageController): Router => {
  const pageRoutes = Router();

  pageRoutes.get('/pages/error', async () => {
    throw new Error('some error');
  });

  pageRoutes.get('/pages/error2', async () => {
    throw new Error('some other error');
  });

  pageRoutes.get('/pages/:path', async (req, res) => {
    const { params } = req;

    const result = await pageController.fetchByPath(`/${params.path}`);

    res.json(result);
  });

  return pageRoutes;
};
