import { ListResearchTagResponse } from '@asap-hub/model';
import { Response, Router } from 'express';
import ResearchTagController from '../controllers/research-tag.controller';
import { validateResearchTagFetchPaginationOptions } from '../validation/research-tag.validation';

export const researchTagRouteFactory = (
  researchTagController: ResearchTagController,
): Router => {
  const researchTagsRoutes = Router();

  researchTagsRoutes.get(
    '/research-tags',
    async (req, res: Response<ListResearchTagResponse>) => {
      const { query } = req;

      const options = validateResearchTagFetchPaginationOptions(query);

      const result = await researchTagController.fetchAll(options);

      res.json(result);
    },
  );

  return researchTagsRoutes;
};
