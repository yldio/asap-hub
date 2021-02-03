import { Router } from 'express';
import Joi from '@hapi/joi';
import { framework } from '@asap-hub/services-common';
import { ResearchOutputController } from '../controllers/research-outputs';

export const researchOutputRouteFactory = (
  researchOutputController: ResearchOutputController,
): Router => {
  const researchOutputRoutes = Router();

  researchOutputRoutes.get('/research-outputs', async (req, res) => {
    const { query } = req;

    const options = (framework.validate(
      'query',
      query,
      querySchema,
    ) as unknown) as {
      take: number;
      skip: number;
      search?: string;
      filter?: string[];
    };

    const result = await researchOutputController.fetch(options);

    res.json(result);
  });

  researchOutputRoutes.get(
    '/research-outputs/:researchOutputId',
    async (req, res) => {
      const { params } = req;
      const { researchOutputId } = framework.validate(
        'parameters',
        params,
        paramsSchema,
      );

      const result = await researchOutputController.fetchById(researchOutputId);

      res.json(result);
    },
  );

  return researchOutputRoutes;
};

const querySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
  search: Joi.string(),
  filter: Joi.array().items(Joi.string()).single(),
}).required();

const paramsSchema = Joi.object({
  researchOutputId: Joi.string().required(),
}).required();
