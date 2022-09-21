import { NewsFrequency } from '@asap-hub/model';
import { validateFetchOptions } from '@asap-hub/server-common';
import { Router } from 'express';
import { NewsController } from '../controllers/news';
import { validateNewsParameters } from '../validation/news.validation';

export const newsRouteFactory = (newsController: NewsController): Router => {
  const newsRoutes = Router();

  newsRoutes.get('/news', async (req, res) => {
    const { query } = req;

    const options = validateFetchOptions(query);

    const result = await newsController.fetch({
      ...options,
      filter: options.filter && {
        frequency: options.filter as NewsFrequency[],
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
