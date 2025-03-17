import { DiscussionResponse, ManuscriptResponse } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { Response, Router } from 'express';
import DiscussionController from '../controllers/discussion.controller';
import ManuscriptController from '../controllers/manuscript.controller';
import {
  validateDiscussionCreateRequest,
  validateDiscussionParameters,
  validateDiscussionRequest,
} from '../validation/discussion.validation';

export const discussionRouteFactory = (
  discussionController: DiscussionController,
  manuscriptController: ManuscriptController,
): Router => {
  const discussionRoutes = Router();

  discussionRoutes.get<{ discussionId: string }>(
    '/discussions/:discussionId',
    async (req, res: Response<DiscussionResponse>) => {
      const { params, loggedInUser } = req;

      if (!loggedInUser) throw Boom.forbidden();

      const { discussionId } = validateDiscussionParameters(params);

      const result = await discussionController.fetchById(discussionId);

      res.json(result);
    },
  );

  discussionRoutes.patch<{ discussionId: string }>(
    '/discussions/:discussionId',
    async (
      req,
      res: Response<{
        discussion: DiscussionResponse;
        manuscript?: ManuscriptResponse;
      }>,
    ) => {
      const { body, params } = req;

      const { discussionId } = validateDiscussionParameters(params);
      const { text, manuscriptId } = validateDiscussionRequest(body);

      if (!req.loggedInUser) throw Boom.forbidden();

      const reply = { text, userId: req.loggedInUser.id };

      const discussion = await discussionController.update(discussionId, reply);

      let manuscript;
      if (manuscriptId)
        manuscript = await manuscriptController.fetchById(manuscriptId);

      res.json({ discussion, manuscript });
    },
  );

  discussionRoutes.patch<{ discussionId: string }>(
    '/discussions/:discussionId/end',
    async (req, res: Response<DiscussionResponse>) => {
      const { params } = req;

      const { discussionId } = validateDiscussionParameters(params);

      if (!req.loggedInUser) throw Boom.forbidden();

      const result = await discussionController.endDiscussion(
        discussionId,
        req.loggedInUser.id,
      );

      res.json(result);
    },
  );

  discussionRoutes.post(
    '/discussions',
    async (req, res: Response<DiscussionResponse>) => {
      const { body } = req;

      const { message: text, id, type } = validateDiscussionCreateRequest(body);

      if (!req.loggedInUser) throw Boom.forbidden();

      const message = {
        text,
        userId: req.loggedInUser.id,
        type,
        ...(type === 'compliance-report' ? { complianceReportId: id } : {}),
      };

      const result = await discussionController.create(message);

      res.json(result);
    },
  );

  return discussionRoutes;
};
