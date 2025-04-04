import { DiscussionResponse } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { Response, Router } from 'express';
import DiscussionController from '../controllers/discussion.controller';
import {
  validateDiscussionCreateRequest,
  validateDiscussionParameters,
  validateDiscussionRequest,
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
      const { text } = validateDiscussionRequest(body);

      if (!req.loggedInUser) throw Boom.forbidden();

      const reply = { text, userId: req.loggedInUser.id };

      const discussion = await discussionController.update(discussionId, reply);
      res.json(discussion);
    },
  );

  discussionRoutes.post(
    '/discussions',
    async (req, res: Response<DiscussionResponse>) => {
      const { body } = req;

      const { manuscriptId, text, title } =
        validateDiscussionCreateRequest(body);

      if (!req.loggedInUser) throw Boom.forbidden();

      const result = await discussionController.create(
        req.loggedInUser.id,
        manuscriptId,
        title,
        text,
      );

      res.json(result);
    },
  );

  return discussionRoutes;
};
