import { Router } from 'express';
import { TutorialsController } from '../controllers/tutorials';
import { validateTutorialParameters } from '../validation/tutorial.validation';

export const tutorialsRouteFactory = (
  tutorialsController: TutorialsController,
): Router => {
  const tutorialsRoutes = Router();

  tutorialsRoutes.get<{ tutorialId: string }>(
    '/tutorials/:tutorialId',
    async (req, res) => {
      const { params } = req;
      const { tutorialId } = validateTutorialParameters(params);
      console.log('tutorialId', tutorialId);
      const result = await tutorialsController.fetchById(tutorialId);

      res.json(result);
    },
  );

  return tutorialsRoutes;
};
