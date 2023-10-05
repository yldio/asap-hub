import { gp2 } from '@asap-hub/model';
import { Router } from 'express';
import TagController from '../controllers/tag.controller';

export const tagRouteFactory = (tagController: TagController): Router => {
  const tagRoutes = Router();

  tagRoutes.get<unknown, gp2.ListTagsResponse>('/tags', async (_req, res) => {
    const tags = await tagController.fetch();

    res.json(tags);
  });

  return tagRoutes;
};
