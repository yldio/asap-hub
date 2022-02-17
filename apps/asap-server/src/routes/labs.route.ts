import { framework } from '@asap-hub/services-common';
import Joi from '@hapi/joi';
import { Router } from 'express';
import { LabsController } from '../controllers/labs';
import { FetchOptions } from '../utils/types';

export const labsRouteFactory = (labsController: LabsController): Router => {
  const labsRoutes = Router();

  labsRoutes.get('/labs', async (req, res) => {
    const options = framework.validate(
      'query',
      req.query,
      querySchema,
    ) as unknown as FetchOptions;

    const result = await labsController.fetch(options);

    res.json(result);
  });

  return labsRoutes;
};

const querySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
  search: Joi.string(),
}).required();
