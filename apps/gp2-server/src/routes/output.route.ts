/* istanbul ignore file */
import { gp2 as gp2Model } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { Response, Router } from 'express';
import OutputController from '../controllers/output.controller';
import {
  validateOutputParameters,
  validateOutputPostRequestParameters,
  validateOutputPutRequestParameters,
  validateOutputsParameters,
} from '../validation/output.validation';

export const outputRouteFactory = (
  outputController: OutputController,
): Router => {
  const outputRoutes = Router();

  outputRoutes.get(
    '/outputs',
    async (req, res: Response<gp2Model.ListOutputResponse>) => {
      const { query } = req;

      const options = validateOutputsParameters(query);

      const result = await outputController.fetch(options);

      res.json(result);
    },
  );

  outputRoutes.get<{ outputId: string }, gp2Model.OutputResponse>(
    '/outputs/:outputId',
    async (req, res) => {
      const { params } = req;
      const { outputId } = validateOutputParameters(params);

      const result = await outputController.fetchById(outputId);

      res.json(result);
    },
  );

  outputRoutes.post('/outputs', async (req, res) => {
    const { body, loggedInUser } = req;
    const createRequest = validateOutputPostRequestParameters(body);

    if (
      !loggedInUser ||
      !hasCreateUpdateOutputPermissions(
        loggedInUser,
        createRequest.mainEntityId,
      )
    ) {
      throw Boom.forbidden();
    }

    const output = await outputController.create({
      ...createRequest,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      createdBy: loggedInUser!.id,
    });

    res.status(201).json(output);
  });

  outputRoutes.put('/outputs/:outputId', async (req, res) => {
    const { body, params, loggedInUser } = req;
    const { outputId } = validateOutputParameters(params);
    const updateRequest = validateOutputPutRequestParameters(body);

    if (
      !loggedInUser ||
      !hasCreateUpdateOutputPermissions(
        loggedInUser,
        updateRequest.mainEntityId,
      )
    ) {
      throw Boom.forbidden();
    }

    const output = await outputController.update(outputId, {
      ...updateRequest,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      updatedBy: loggedInUser!.id,
    });

    res.status(200).json(output);
  });

  return outputRoutes;
};
const hasCreateUpdateOutputPermissions = (
  user: gp2Model.UserResponse,
  entityId?: string,
) =>
  user.role === 'Administrator' ||
  user.projects
    .filter((proj: gp2Model.UserProject) => proj.id === entityId)[0]
    ?.members.filter(
      (member: gp2Model.UserProjectMember) => member.userId === user.id,
    )[0]?.role === 'Project manager';
