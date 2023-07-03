import { Router } from 'express';
import TutorialController from '../controllers/tutorial.controller';
import { validateTutorialParameters } from '../validation/tutorial.validation';

export const tutorialRouteFactory = (
  tutorialController: TutorialController,
): Router => {
  const tutorialsRoutes = Router();

  tutorialsRoutes.get<{ tutorialId: string }>(
    '/tutorials/:tutorialId',
    async (req, res) => {
      const { tutorialId } = validateTutorialParameters(req.params);
      const result = await tutorialController.fetchById(tutorialId);

      res.json(result);
    },
  );

  return tutorialsRoutes;
};
