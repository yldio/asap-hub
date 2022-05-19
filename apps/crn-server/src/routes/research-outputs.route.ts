import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
} from '@asap-hub/model';
import { hasCreateUpdateResearchOutputPermissions } from '@asap-hub/validation';
import Boom from '@hapi/boom';
import { Response, Router } from 'express';
import { ResearchOutputController } from '../controllers/research-outputs';
import { validateFetchOptions } from '../validation';
import {
  validateResearchOutputParameters,
  validateResearchOutputPostRequestParameters,
  validateResearchOutputPostRequestParametersIdentifiers,
  validateResearchOutputPutRequestParameters,
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
    const { body, loggedInUser } = req;
    const createRequest = validateResearchOutputPostRequestParameters(body);
    validateResearchOutputPostRequestParametersIdentifiers(createRequest);

    if (
      !loggedInUser ||
      !hasCreateUpdateResearchOutputPermissions(
        loggedInUser,
        createRequest.teams,
      )
    ) {
      throw Boom.forbidden();
    }

    const researchOutput = await researchOutputController.create({
      ...createRequest,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      createdBy: loggedInUser!.id,
    });

    res.status(201).json(researchOutput);
  });

  researchOutputRoutes.put(
    '/research-outputs/:researchOutputId',
    async (req, res) => {
      const { body, params, loggedInUser } = req;
      const { researchOutputId } = validateResearchOutputParameters(params);
      const updateRequest = validateResearchOutputPutRequestParameters(body);
      validateResearchOutputPostRequestParametersIdentifiers(body);

      if (
        !loggedInUser ||
        !hasCreateUpdateResearchOutputPermissions(
          loggedInUser,
          updateRequest.teams,
        )
      ) {
        throw Boom.forbidden();
      }

      const researchOutput = await researchOutputController.update(
        researchOutputId,
        {
          ...updateRequest,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          updatedBy: loggedInUser!.id,
        },
      );

      res.status(200).json(researchOutput);
    },
  );

  return researchOutputRoutes;
};
