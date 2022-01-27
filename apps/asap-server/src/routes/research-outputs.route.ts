import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { framework } from '@asap-hub/services-common';
import Joi from '@hapi/joi';
import { Response, Router } from 'express';
import { ResearchOutputController } from '../controllers/research-outputs';
import { TeamController } from '../controllers/teams';

export const researchOutputRouteFactory = (
  researchOutputController: ResearchOutputController,
  teamController: TeamController,
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

    const {
      type,
      link,
      title,
      asapFunded,
      sharingStatus,
      usedInPublication,
      addedDate,
      teamId,
    } = framework.validate('body', body, createSchema);

    const id = await researchOutputController.create({
      type,
      link,
      title,
      asapFunded,
      sharingStatus,
      usedInPublication,
      addedDate,
    });

    await teamController.merge(teamId, [id]);

    res.status(201).json({ id });
  });

  return researchOutputRoutes;
};
const createSchema = Joi.object({
  type: Joi.string().required(),
  link: Joi.string().required(),
  title: Joi.string().required(),
  asapFunded: Joi.boolean().required(),
  sharingStatus: Joi.string().required(),
  usedInPublication: Joi.boolean().required(),
  addedDate: Joi.string().required(),
  teamId: Joi.string().required(),
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
