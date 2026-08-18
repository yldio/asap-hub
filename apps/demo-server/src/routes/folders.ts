import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { requireCreator } from '../auth';
import { folderEntity, videoEntity } from '../data/entities';
import { createFolderSchema, renameFolderSchema } from '../schemas';
import { deleteVideoCascade } from './cascade';
import { pathParam } from './request';
import { validate } from './validate';
import { asyncRouter } from './async-router';

export const rootFolderId = 'ROOT';

export const foldersRouter = (): Router => {
  const router = asyncRouter();

  router.get('/', async (_req, res) => {
    const { data } = await folderEntity.query.all({}).go({ pages: 'all' });
    res.json({
      items: [
        { id: rootFolderId, name: 'Unfiled' },
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

  router.patch(
    '/:id',
    requireCreator,
    validate(renameFolderSchema),
    async (req, res) => {
      const id = pathParam(req, 'id');
      if (id === rootFolderId) {
        res.status(400).json({ error: 'root_folder' });
        return;
      }

      const { name } = req.body as { name: string };
      const existing = await folderEntity.get({ id }).go();
      if (!existing.data) {
        res.status(404).json({ error: 'not_found' });
        return;
      }

      // name is part of GSI1SK, so the item is rewritten wholesale to recompute the key
      await folderEntity.put({ ...existing.data, name }).go();

      res.json({ id, name });
    },
  );

  router.delete('/:id', requireCreator, async (req, res) => {
    const id = pathParam(req, 'id');
    if (id === rootFolderId) {
      res.status(400).json({ error: 'root_folder' });
      return;
    }

    const existing = await folderEntity.get({ id }).go();
    if (!existing.data) {
      res.status(404).json({ error: 'not_found' });
      return;
    }

    const { data: videos } = await videoEntity.query
      .byFolder({ folderId: id })
      .go({ pages: 'all' });

    await Promise.all(
      videos.map(async (video) => {
        try {
          await deleteVideoCascade(video.id);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`failed to delete video ${video.id}`, error);
        }
      }),
    );

    await folderEntity.delete({ id }).go();
    res.status(204).end();
  });

  return router;
};
