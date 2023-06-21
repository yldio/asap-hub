import {
  ListResearchOutputResponse,
  ResearchOutputResponse,
  ResearchOutputTeamResponse,
  ResearchOutputWorkingGroupResponse,
  UserResponse,
} from '@asap-hub/model';
import {
  getUserRole,
  hasEditResearchOutputPermission,
} from '@asap-hub/validation';
import Boom from '@hapi/boom';
import { Response, Router } from 'express';
import ResearchOutputController from '../controllers/research-outputs.controller';
import {
  validateResearchOutputParameters,
  validateResearchOutputPostRequestParameters,
  validateResearchOutputPostRequestParametersIdentifiers,
  validateResearchOutputPutRequestParameters,
  validateResearchOutputFetchOptions,
} from '../validation/research-output.validation';

export const researchOutputRouteFactory = (
  researchOutputController: ResearchOutputController,
): Router => {
  const researchOutputRoutes = Router();

  researchOutputRoutes.get(
    '/research-outputs',
    async (req, res: Response<ListResearchOutputResponse>) => {
      const { query, loggedInUser } = req;
      const { teamId, status, workingGroupId, ...options } =
        validateResearchOutputFetchOptions(query);
      const isRequestingDrafts = status === 'draft';

      if (isRequestingDrafts) {
        const hasTeamRole = teamId
          ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            getUserRole(loggedInUser!, 'teams', [teamId]) !== 'None'
          : false;

        const hasWorkingGroupRole = workingGroupId
          ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            getUserRole(loggedInUser!, 'workingGroups', [workingGroupId]) !==
            'None'
          : false;

        if (!hasTeamRole && !hasWorkingGroupRole) {
          throw Boom.forbidden();
        }
      }

      const result = await researchOutputController.fetch({
        ...options,
        ...(isRequestingDrafts && {
          includeDrafts: true,
          filter: {
            status,
            workingGroupId,
            teamId,
          },
        }),
      });

      res.json(result);
    },
  );

  researchOutputRoutes.get<{ researchOutputId: string }>(
    '/research-outputs/:researchOutputId',
    async (req, res: Response<ResearchOutputResponse>) => {
      const { params } = req;

      if (!req.loggedInUser) throw Boom.forbidden();

      const { researchOutputId } = validateResearchOutputParameters(params);

      const result = await researchOutputController.fetchById(researchOutputId);

      if (!result.published && !hasAccessToDraft(req.loggedInUser, result)) {
        throw Boom.notFound(
          'You do not have permission to view this research-output',
        );
      }

      res.json(result);
    },
  );

  researchOutputRoutes.post('/research-outputs', async (req, res) => {
    const { body, loggedInUser } = req;
    const createRequest = validateResearchOutputPostRequestParameters(body);
    validateResearchOutputPostRequestParametersIdentifiers(createRequest);

    const workingGroupOutput = createRequest.workingGroups.length;

    const userRole = getUserRole(
      loggedInUser as UserResponse,
      workingGroupOutput ? 'workingGroups' : 'teams',
      workingGroupOutput ? createRequest.workingGroups : createRequest.teams,
    );

    if (
      !loggedInUser ||
      !hasEditResearchOutputPermission(userRole, createRequest.published)
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

      const workingGroupOutput = updateRequest.workingGroups.length;

      const userRole = getUserRole(
        loggedInUser as UserResponse,
        workingGroupOutput ? 'workingGroups' : 'teams',
        workingGroupOutput ? updateRequest.workingGroups : updateRequest.teams,
      );

      if (
        !loggedInUser ||
        !hasEditResearchOutputPermission(userRole, updateRequest.published)
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

export const hasAccessToDraft = (
  loggedInUser: UserResponse,
  researchOutput:
    | ResearchOutputTeamResponse
    | ResearchOutputWorkingGroupResponse,
): boolean => {
  if (loggedInUser.role === 'Staff') {
    return true;
  }
  if (!researchOutput.workingGroups) {
    return loggedInUser.teams.some((userTeam) =>
      researchOutput.teams.find((outputTeam) => outputTeam.id === userTeam.id),
    );
  }
  return loggedInUser.workingGroups.some((userWorkingGroup) =>
    researchOutput?.workingGroups.find(
      (outputWorkingGroup) => outputWorkingGroup.id === userWorkingGroup.id,
    ),
  );
};
