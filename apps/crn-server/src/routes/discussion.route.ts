import { DiscussionResponse } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { Response, Router } from 'express';
import DiscussionController from '../controllers/discussion.controller';
import {
  validateDiscussionCreateRequest,
  validateDiscussionParameters,
  validateDiscussionPatchRequest,
} from '../validation/discussion.validation';

export const discussionRouteFactory = (
  discussionController: DiscussionController,
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
    async (req, res: Response<DiscussionResponse>) => {
      const { body, params } = req;

      const { discussionId } = validateDiscussionParameters(params);
      const { replyText } = validateDiscussionPatchRequest(body);

      if (!req.loggedInUser) throw Boom.forbidden();

      const reply = { text: replyText, userId: req.loggedInUser.id };

      const result = await discussionController.update(discussionId, reply);

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
