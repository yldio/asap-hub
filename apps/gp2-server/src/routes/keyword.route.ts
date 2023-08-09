import { gp2 } from '@asap-hub/model';
import { Router } from 'express';
import KeywordController from '../controllers/keyword.controller';

export const keywordRouteFactory = (
  keywordController: KeywordController,
): Router => {
  const keywordRoutes = Router();

  keywordRoutes.get<unknown, gp2.ListKeywordsResponse>(
    '/keywords',
    async (_req, res) => {
      const keywords = await keywordController.fetch();

      res.json(keywords);
    },
  );

  return keywordRoutes;
};
