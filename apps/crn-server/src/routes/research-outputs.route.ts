import { ValidationError } from '@asap-hub/errors';
import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
  VALIDATION_ERROR_MESSAGE,
  ValidationErrorResponse,
} from '@asap-hub/model';
import { hasCreateResearchOutputPermissions } from '@asap-hub/validation';
import Boom from '@hapi/boom';
import { Response, Router } from 'express';
import { ResearchOutputController } from '../controllers/research-outputs';
import { validateFetchOptions } from '../validation';
import {
  validateResearchOutputParameters,
  validateResearchOutputPostRequestParameters,
  validateResearchOutputPostRequestParametersIdentifiers,
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
      !hasCreateResearchOutputPermissions(loggedInUser, createRequest.teams)
    ) {
      throw Boom.forbidden();
    }

    try {
      const researchOutput = await researchOutputController.create({
        ...createRequest,
        createdBy: loggedInUser.id,
      });

      res.status(201).json(researchOutput);
    } catch (error) {
      // TODO: move this logic to the controller and catch in the error-handler
      // https://asaphub.atlassian.net/browse/CRN-777

      if (
        error instanceof ValidationError &&
        error.details[0]?.includes(
          'link.iv: Another content with the same value exists',
        )
      ) {
        throw Boom.badRequest<ValidationErrorResponse['data']>(
          VALIDATION_ERROR_MESSAGE,
          [
            {
              instancePath: '/link',
              keyword: 'unique',
              message: 'must be unique',
              params: {
                type: 'string',
              },
              schemaPath: '#/properties/link/unique',
            },
          ],
        );
      }

      throw error;
    }
  });

  return researchOutputRoutes;
};
