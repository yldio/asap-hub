import { Router } from 'express';
import { NewsController } from '../controllers/news';
import {
  validateNewsFetchParameters,
  validateNewsParameters,
} from '../validation/news.validation';

export const newsRouteFactory = (newsController: NewsController): Router => {
  const newsRoutes = Router();

  newsRoutes.get('/news', async (req, res) => {
    const { query } = req;

    const options = validateNewsFetchParameters(query);

    const result = await newsController.fetch({
      ...options,
      filter: options.filter && {
        frequency: options.filter,
      },
    });

    res.json(result);
  });

  newsRoutes.get<{ newsId: string }>('/news/:newsId', async (req, res) => {
    const { params } = req;
    const { newsId } = validateNewsParameters(params);

    const result = await newsController.fetchById(newsId);

    res.json(result);
  });

  return newsRoutes;
};
