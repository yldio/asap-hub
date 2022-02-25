import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { Response, Router } from 'express';
import { ResearchOutputController } from '../controllers/research-outputs';
import { validateFetchOptions } from '../validation';
import {
  validateResearchOutputParameters,
  validateResearchOutputPostRequestParameters,
} from '../validation/research-output.validation';

export const researchOutputRouteFactory = (
  researchOutputController: ResearchOutputController,
): Router => {
  const researchOutputRoutes = Router();

  researchOutputRoutes.get(
    '/research-outputs',
    async (req, res: Response<ListResearchOutputResponse>) => {
      const { query } = req;

      const options = validateFetchOptions(query);

      const result = await researchOutputController.fetch(options);

      res.json(result);
    },
  );

  researchOutputRoutes.get<{ researchOutputId: string }>(
    '/research-outputs/:researchOutputId',
    async (req, res: Response<ResearchOutputResponse>) => {
      const { params } = req;
      const { researchOutputId } = validateResearchOutputParameters(params);

      const result = await researchOutputController.fetchById(researchOutputId);

      res.json(result);
    },
  );

  researchOutputRoutes.post('/research-outputs', async (req, res) => {
    const { body } = req;

    const createRequest = validateResearchOutputPostRequestParameters(body);
    const researchOutput = await researchOutputController.create(createRequest);

    res.status(201).json(researchOutput);
  });

  return researchOutputRoutes;
};
