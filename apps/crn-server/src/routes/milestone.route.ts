import Boom from '@hapi/boom';
import { isProjectLead } from '@asap-hub/model';
import { Router } from 'express';
import MilestoneController from '../controllers/milestone.controller';
import ProjectController from '../controllers/project.controller';
import { validateMilestoneArticleUpdateRequest } from '../validation/milestone.validation';

export const milestoneRouteFactory = (
  milestoneController: MilestoneController,
  projectController: ProjectController,
): Router => {
  const milestoneRoutes = Router();

  milestoneRoutes.get('/milestones/:milestoneId/articles', async (req, res) => {
    const { milestoneId } = req.params;
    const { loggedInUser } = req;

    if (!loggedInUser) throw Boom.forbidden();

    const articles = await milestoneController.fetchArticles(milestoneId);
    res.json(articles);
  });

  milestoneRoutes.put('/milestones/:milestoneId/articles', async (req, res) => {
    if (!req.loggedInUser) throw Boom.forbidden();

    const { milestoneId } = req.params;
    const { articleIds } = validateMilestoneArticleUpdateRequest(req.body);

    const milestone = await milestoneController.fetchById(milestoneId);
    const project = await projectController.fetchById(milestone.projectId);

    if (!isProjectLead(req.loggedInUser.id, req.loggedInUser.teams, project)) {
      throw Boom.forbidden();
    }

    await milestoneController.updateArticles(milestoneId, articleIds);
    res.json({ success: true });
  });

  return milestoneRoutes;
};
