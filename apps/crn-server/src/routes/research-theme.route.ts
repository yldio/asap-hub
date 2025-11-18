import { ListResearchThemeResponse } from '@asap-hub/model';
import { Response, Router } from 'express';
import ResearchThemeController from '../controllers/research-theme.controller';

export const researchThemeRouteFactory = (
  researchThemeController: ResearchThemeController,
): Router => {
  const researchThemesRoutes = Router();

  researchThemesRoutes.get(
    '/research-themes',
    async (_req, res: Response<ListResearchThemeResponse>) => {
      const result = await researchThemeController.fetch();
      res.json(result);
    },
  );

  return researchThemesRoutes;
};
