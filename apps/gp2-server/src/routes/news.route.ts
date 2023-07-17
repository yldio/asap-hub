import { gp2 } from '@asap-hub/model';
import { Router } from 'express';
import NewsController from '../controllers/news.controller';
import {
  validateNewsFetchParameters,
} from '../validation/news.validation';

export const newsRouteFactory = (newsController: NewsController): Router => {
  const newsRoutes = Router();

  newsRoutes.get<unknown, gp2.ListNewsResponse>('/news', async (req, res) => {
    const { query } = req;

    const options = validateNewsFetchParameters(query);
    const news = await newsController.fetch({
      ...options,
      filter: options.filter && {
        frequency: options.filter,
      },
    });

    res.json(news);
  });

  return newsRoutes;
};
