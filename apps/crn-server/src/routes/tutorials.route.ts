import { Router } from 'express';
import { TutorialsController } from '../controllers/tutorials.controller';
import { validateTutorialParameters } from '../validation/tutorial.validation';

export const tutorialsRouteFactory = (
  tutorialsController: TutorialsController,
): Router => {
  const tutorialsRoutes = Router();

  tutorialsRoutes.get<{ tutorialId: string }>(
    '/tutorials/:tutorialId',
    async (req, res) => {
      const { tutorialId } = validateTutorialParameters(req.params);
      const result = await tutorialsController.fetchById(tutorialId);

      res.json(result);
    },
  );

  return tutorialsRoutes;
};
