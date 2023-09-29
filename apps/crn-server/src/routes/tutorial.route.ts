import { Router } from 'express';
import { validateFetchOptions } from '@asap-hub/server-common';
import TutorialController from '../controllers/tutorial.controller';
import { validateTutorialParameters } from '../validation/tutorial.validation';

export const tutorialRouteFactory = (
  tutorialController: TutorialController,
): Router => {
  const tutorialsRoutes = Router();

  tutorialsRoutes.get('/tutorials', async (req, res) => {
    const { query } = req;

    const options = validateFetchOptions(query);

    const result = await tutorialController.fetch({
      ...options,
    });

    res.json(result);
  });

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
