import { Router } from 'express';
import { framework } from '@asap-hub/services-common';
import Joi from '@hapi/joi';
import { NewsController } from '../controllers/news';

export const newsRouteFactory = (newsController: NewsController): Router => {
  const newsRoutes = Router();

  newsRoutes.get('/news', async (req, res) => {
    const { query } = req;

    const options = framework.validate(
      'query',
      query,
      fetchQuerySchema,
    ) as unknown as {
      take: number;
      skip: number;
    };

    const result = await newsController.fetch(options);

    res.json(result);
  });

  newsRoutes.get('/news/:newsId', async (req, res) => {
    const { params } = req;
    const { newsId } = framework.validate('parameters', params, paramSchema);

    const result = await newsController.fetchById(newsId);

    res.json(result);
  });

  return newsRoutes;
};

const paramSchema = Joi.object({
  newsId: Joi.string().required(),
});

const fetchQuerySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
}).required();
