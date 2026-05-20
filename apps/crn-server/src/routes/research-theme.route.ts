import { ListResearchThemeResponse } from '@asap-hub/model';
import { Request, Response, Router } from 'express';
import ResearchThemeController from '../controllers/research-theme.controller';
import { validateResearchThemeFetchParameters } from '../validation/research-theme.validation';

export const researchThemeRouteFactory = (
  researchThemeController: ResearchThemeController,
): Router => {
  const researchThemesRoutes = Router();

  researchThemesRoutes.get(
    '/research-themes',
    async (req: Request, res: Response<ListResearchThemeResponse>) => {
      const { types } = validateResearchThemeFetchParameters(req.query);

      const result = await researchThemeController.fetch(
        types
          ? {
              filter: { types },
            }
          : {},
      );
      res.json(result);
    },
  );

  return researchThemesRoutes;
};
