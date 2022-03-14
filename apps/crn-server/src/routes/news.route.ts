import { Router } from 'express';
import { NewsController } from '../controllers/news';
import { validateFetchPaginationOptions } from '../validation';
import { validateNewsParameters } from '../validation/news.validation';

export const newsRouteFactory = (newsController: NewsController): Router => {
  const newsRoutes = Router();

  newsRoutes.get('/news', async (req, res) => {
    const { query } = req;

    const options = validateFetchPaginationOptions(query);

    const result = await newsController.fetch(options);

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
