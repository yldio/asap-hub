import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
  UserResponse,
} from '@asap-hub/model';
import { validateFetchOptions } from '@asap-hub/server-common';
import {
  getUserRole,
  hasEditResearchOutputPermission,
} from '@asap-hub/validation';
import Boom from '@hapi/boom';
import { Response, Router } from 'express';
import {
  ResearchOutputFetchOptions,
  ResearchOutputController,
} from '../controllers/research-outputs';
import {
  validateResearchOutputParameters,
  validateResearchOutputPostRequestParameters,
  validateResearchOutputPostRequestParametersIdentifiers,
  validateResearchOutputRequestQueryParameters,
  validateResearchOutputPutRequestParameters,
  validateResearchOutputDraftFetchOptions,
} from '../validation/research-output.validation';

export const researchOutputRouteFactory = (
  researchOutputController: ResearchOutputController,
): Router => {
  const researchOutputRoutes = Router();

  researchOutputRoutes.get(
    '/research-outputs',
    async (req, res: Response<ListResearchOutputResponse>) => {
      const { query, loggedInUser } = req;

      const { associationId, status, ...options } = query.status
        ? validateResearchOutputDraftFetchOptions(query)
        : { ...validateFetchOptions(query), associationId: '', status: false };

      const hasTeamRole =
        getUserRole(loggedInUser as UserResponse, 'teams', [associationId]) !==
        'None';
      const hasWorkingGroupRole =
        getUserRole(loggedInUser as UserResponse, 'workingGroups', [
          associationId,
        ]) !== 'None';

      if (status && !hasTeamRole && !hasWorkingGroupRole) {
        throw Boom.forbidden();
      }

      const result = await researchOutputController.fetch({
        ...options,
        ...(status && {
          includeDrafts: true,
          filter: `status eq 'Draft' and (data/workingGroups/iv in ['${associationId}'] or data/teams/iv in ['${associationId}'])`,
        }),
      } as ResearchOutputFetchOptions);

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

    const userRole = getUserRole(
      loggedInUser as UserResponse,
      'teams',
      createRequest.teams,
    );

    const options = validateResearchOutputRequestQueryParameters(query);
    const publish = options.publish ?? true;

    if (!loggedInUser || !hasEditResearchOutputPermission(userRole, false)) {
      throw Boom.forbidden();
    }

    const researchOutput = await researchOutputController.create(
      {
        ...createRequest,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        createdBy: loggedInUser!.id,
      },
      { publish },
    );

    res.status(201).json(researchOutput);
  });

  researchOutputRoutes.put(
    '/research-outputs/:researchOutputId',
    async (req, res) => {
      const { body, params, loggedInUser } = req;
      const { researchOutputId } = validateResearchOutputParameters(params);
      const updateRequest = validateResearchOutputPutRequestParameters(body);
      validateResearchOutputPostRequestParametersIdentifiers(body);

      const userRole = getUserRole(
        loggedInUser as UserResponse,
        'teams',
        updateRequest.teams,
      );

      // TODO: update the published value in hasEditResearchOutputPermission in
      // display draft task. Currently we are not sending the value published
      if (!loggedInUser || !hasEditResearchOutputPermission(userRole, false)) {
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
