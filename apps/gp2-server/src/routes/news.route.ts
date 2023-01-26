import { gp2 } from '@asap-hub/model';
import { Router } from 'express';
import { NewsController } from '../controllers/news.controller';

export const newsRouteFactory = (newsController: NewsController): Router => {
  const newsRoutes = Router();

  newsRoutes.get<unknown, gp2.ListNewsResponse>('/news', async (_req, res) => {
    const news = await newsController.fetch();

    res.json(news);
  });

  return newsRoutes;
};
