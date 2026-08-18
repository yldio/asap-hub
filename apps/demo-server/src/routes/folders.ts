import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { requireCreator } from '../auth';
import { folderEntity } from '../data/entities';
import { createFolderSchema } from '../schemas';
import { validate } from './validate';
import { asyncRouter } from './async-router';

export const foldersRouter = (): Router => {
  const router = asyncRouter();

  router.get('/', async (_req, res) => {
    const { data } = await folderEntity.query.all({}).go({ pages: 'all' });
    res.json({
      items: [
        { id: 'ROOT', name: 'Unfiled' },
        ...data.map(({ id, name }) => ({ id, name })),
      ],
    });
  });

  router.post(
    '/',
    requireCreator,
    validate(createFolderSchema),
    async (req, res) => {
      const id = uuid();
      const { name } = req.body as { name: string };
      await folderEntity
        .create({ id, name, createdAt: new Date().toISOString() })
        .go();
      res.json({ id, name });
    },
  );

  return router;
};
