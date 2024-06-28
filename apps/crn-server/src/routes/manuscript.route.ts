import { ManuscriptResponse } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { Response, Router } from 'express';

import ManuscriptController from '../controllers/manuscript.controller';
import {
  validateManuscriptParameters,
  validateManuscriptPostRequestParameters,
} from '../validation/manuscript.validation';

export const manuscriptRouteFactory = (
  manuscriptController: ManuscriptController,
): Router => {
  const manuscriptRoutes = Router();

  manuscriptRoutes.get<{ manuscriptId: string }>(
    '/manuscripts/:manuscriptId',
    async (req, res: Response<ManuscriptResponse>) => {
      const { params, loggedInUser } = req;

      if (!loggedInUser) throw Boom.forbidden();

      const { manuscriptId } = validateManuscriptParameters(params);

      const result = await manuscriptController.fetchById(manuscriptId);

      res.json(result);
    },
  );

  manuscriptRoutes.post('/manuscripts', async (req, res) => {
    const { body, loggedInUser } = req;
    const createRequest = validateManuscriptPostRequestParameters(body);

    const userBelongsToTeam = loggedInUser?.teams.some(
      (team) => team.id === createRequest.teamId,
    );

    if (!loggedInUser || !userBelongsToTeam) throw Boom.forbidden();

    const manuscript = await manuscriptController.create({
      ...createRequest,
      userId: loggedInUser.id,
    });

    res.status(201).json(manuscript);
  });

  return manuscriptRoutes;
};
