import { Router } from 'express';
import { ExternalAuthorsController } from '../controllers/external-authors';
import { validateExternalAuthorParameters } from '../validation/external-authors.validation';

export const externalAuthorsRouteFactory = (
  externalAuthorsController: ExternalAuthorsController,
): Router => {
  const externalAuthorsRoutes = Router();

  externalAuthorsRoutes.post('/external-authors', async (req, res) => {
    const { body } = req;

    const createRequest = validateExternalAuthorParameters(body);

    const result = await externalAuthorsController.create(createRequest);

    res.status(201).json(result);
  });

  return externalAuthorsRoutes;
};
