import { DiscussionResponse } from '@asap-hub/model';
import Boom from '@hapi/boom';
import { Response, Router } from 'express';
import DiscussionController from '../controllers/discussion.controller';
import {
  validateDiscussionCreateRequest,
  validateDiscussionParameters,
  validateDiscussionRequest,
} from '../validation/discussion.validation';
import ManuscriptController from '../controllers/manuscript.controller';

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
    async (req, res: Response<DiscussionResponse>) => {
      const { body, params } = req;

      const { discussionId } = validateDiscussionParameters(params);
      const { text, notificationList, manuscriptId } =
        validateDiscussionRequest(body);

      if (!req.loggedInUser) throw Boom.forbidden();

      if (manuscriptId) {
        const manuscript = await manuscriptController.fetchById(
          manuscriptId,
          req.loggedInUser.id,
        );
        if (
          manuscript.status === 'Compliant' ||
          manuscript.status === 'Closed (other)'
        ) {
          throw Boom.forbidden(
            'The manuscript status has been changed to compliant or closed, which disables new discussions and replies.',
          );
        }
      }

      const reply = {
        text,
        isOpenScienceMember: Boolean(req.loggedInUser.openScienceTeamMember),
      };

      const discussion = await discussionController.update(
        discussionId,
        req.loggedInUser.id,
        reply,
        manuscriptId,
        notificationList || '',
      );
      res.json(discussion);
    },
  );

  discussionRoutes.post(
    '/discussions',
    async (req, res: Response<DiscussionResponse>) => {
      const { body } = req;

      const { manuscriptId, text, title, notificationList } =
        validateDiscussionCreateRequest(body);

      if (!req.loggedInUser) throw Boom.forbidden();

      if (manuscriptId) {
        const manuscript = await manuscriptController.fetchById(
          manuscriptId,
          req.loggedInUser.id,
        );
        if (
          manuscript.status === 'Compliant' ||
          manuscript.status === 'Closed (other)'
        ) {
          throw Boom.forbidden(
            'The manuscript status has been changed to compliant or closed, which disables new discussions and replies.',
          );
        }
      }

      const result = await discussionController.create(
        req.loggedInUser.id,
        manuscriptId,
        title,
        text,
        notificationList || '',
      );

      res.json(result);
    },
  );

  discussionRoutes.patch<{ discussionId: string }>(
    '/discussions/:discussionId/read',
    async (req, res: Response<DiscussionResponse>) => {
      const { params } = req;

      const { discussionId } = validateDiscussionParameters(params);

      if (!req.loggedInUser) throw Boom.forbidden();

      const discussion = await discussionController.update(
        discussionId,
        req.loggedInUser.id,
      );
      res.json(discussion);
    },
  );

  return discussionRoutes;
};
