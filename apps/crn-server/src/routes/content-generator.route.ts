import {
  ContentGeneratorRequest,
  ContentGeneratorResponse,
} from '@asap-hub/model';
import { Router } from 'express';
import ContentGeneratorController from '../controllers/content-generator.controller';
import { validateGenerateContentRequestParameters } from '../validation/content-generator.validation';

export const contentGeneratorRouteFactory = (
  contentGeneratorController: ContentGeneratorController,
): Router => {
  const contentGeneratorRoutes = Router();

  contentGeneratorRoutes.post<
    ContentGeneratorRequest,
    ContentGeneratorResponse
  >('/generate-content', async (req, res) => {
    const { body } = req;
    const generateRequest = validateGenerateContentRequestParameters(body);

    const output =
      await contentGeneratorController.generateContent(generateRequest);

    res.status(200).json(output);
  });

  return contentGeneratorRoutes;
};
