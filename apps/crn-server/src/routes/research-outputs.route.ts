import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
  UserResponse,
} from '@asap-hub/model';
import { validateFetchOptions } from '@asap-hub/server-common';
import { getUserPermissions } from '@asap-hub/validation';
import Boom from '@hapi/boom';
import { Response, Router } from 'express';
import { ResearchOutputController } from '../controllers/research-outputs';
import {
  validateResearchOutputParameters,
  validateResearchOutputPostRequestParameters,
  validateResearchOutputPostRequestParametersIdentifiers,
  validateResearchOutputRequestQueryParameters,
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
    const { body, loggedInUser, query } = req;
    const createRequest = validateResearchOutputPostRequestParameters(body);
    validateResearchOutputPostRequestParametersIdentifiers(createRequest);

    const permissions = getUserPermissions(
      loggedInUser as UserResponse,
      'teams',
      createRequest.teams,
    );

    const options = validateResearchOutputRequestQueryParameters(query);
    const published = options.published ?? true;

    const isRequestAllowed =
      (permissions.saveDraft && !published) ||
      (permissions.publish && published);

    if (!loggedInUser || !isRequestAllowed) {
      throw Boom.forbidden();
    }

    const researchOutput = await researchOutputController.create(
      {
        ...createRequest,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        createdBy: loggedInUser!.id,
      },
      published,
    );

    res.status(201).json(researchOutput);
  });

  researchOutputRoutes.put(
    '/research-outputs/:researchOutputId',
    async (req, res) => {
      const { body, params, loggedInUser, query } = req;
      const { researchOutputId } = validateResearchOutputParameters(params);
      const updateRequest = validateResearchOutputPutRequestParameters(body);
      validateResearchOutputPostRequestParametersIdentifiers(body);

      const permissions = getUserPermissions(
        loggedInUser as UserResponse,
        'teams',
        updateRequest.teams,
      );

      const options = validateResearchOutputRequestQueryParameters(query);
      const published = options.published ?? true;

      const isRequestAllowed =
        (permissions.saveDraft && !published) ||
        (permissions.publish && published);

      if (!loggedInUser || !isRequestAllowed) {
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
