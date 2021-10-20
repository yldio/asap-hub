import { Router } from 'express';
import { framework } from '@asap-hub/services-common';
import Joi from '@hapi/joi';
import { NewsAndEventsController } from '../controllers/news-and-events';
import Boom from '@hapi/boom';

export const newsAndEventsRouteFactory = (
  newsAndEventsController: NewsAndEventsController,
): Router => {
  const newsAndEventsRoutes = Router();

  newsAndEventsRoutes.get('/news-and-events', async (req, res) => {
    const { query } = req;

    const options = framework.validate(
      'query',
      query,
      fetchQuerySchema,
    ) as unknown as {
      take: number;
      skip: number;
    };

    const result = await newsAndEventsController.fetch(options);

    res.json(result);
  });

  newsAndEventsRoutes.get(
    '/news-and-events/:newsAndEventsId',
    async (req, res) => {
      const { params } = req;
      const { newsAndEventsId } = framework.validate(
        'parameters',
        params,
        paramSchema,
      );

      if (newsAndEventsId === undefined) {
        throw Boom.badRequest('newsAndEventsId cannot be undefined');
      }

      const result = await newsAndEventsController.fetchById(newsAndEventsId);

      res.json(result);
    },
  );

  return newsAndEventsRoutes;
};

const paramSchema = Joi.object({
  newsAndEventsId: Joi.string().required(),
});

const fetchQuerySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
}).required();
