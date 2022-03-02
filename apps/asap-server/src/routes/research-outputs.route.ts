import {
  ListResearchOutputResponse,
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  researchOutputSubtypes,
  researchOutputTypes,
} from '@asap-hub/model';
import { framework } from '@asap-hub/services-common';
import Joi from '@hapi/joi';
import { Response, Router } from 'express';
import { ResearchOutputController } from '../controllers/research-outputs';

export const researchOutputRouteFactory = (
  researchOutputController: ResearchOutputController,
): Router => {
  const researchOutputRoutes = Router();

  researchOutputRoutes.get(
    '/research-outputs',
    async (req, res: Response<ListResearchOutputResponse>) => {
      const { query } = req;

      const options = framework.validate(
        'query',
        query,
        querySchema,
      ) as unknown as {
        take: number;
        skip: number;
        search?: string;
        filter?: string[];
      };

      const result = await researchOutputController.fetch(options);

      res.json(result);
    },
  );

  researchOutputRoutes.get<{ researchOutputId: string }>(
    '/research-outputs/:researchOutputId',
    async (req, res: Response<ResearchOutputResponse>) => {
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

  researchOutputRoutes.post('/research-outputs', async (req, res) => {
    const { body } = req;

    const createRequest = framework.validate('body', body, createSchema);
    const researchOutput = await researchOutputController.create(createRequest);

    res.status(201).json(researchOutput);
  });

  return researchOutputRoutes;
};
const createSchema = Joi.object<ResearchOutputPostRequest>({
  type: Joi.string()
    .required()
    .valid(...researchOutputTypes),
  subTypes: Joi.array()
    .single()
    .items(Joi.string().valid(...researchOutputSubtypes)),
  description: Joi.string().required(),
  tags: Joi.array().required(),
  link: Joi.string().required(),
  title: Joi.string().required(),
  asapFunded: Joi.boolean(),
  sharingStatus: Joi.string().required(),
  usedInPublication: Joi.boolean(),
  addedDate: Joi.string().required(),
  teamId: Joi.string().required(),
  labs: Joi.array().required(),
  authors: Joi.array().required(),
}).required();

const querySchema = Joi.object({
  take: Joi.number(),
  skip: Joi.number(),
  search: Joi.string(),
  filter: Joi.array().items(Joi.string()).single(),
}).required();

const paramsSchema = Joi.object({
  researchOutputId: Joi.string().required(),
}).required();
