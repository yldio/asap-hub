import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { Request, Response, Router } from 'express';
import { canViewDrafts, requireCreator } from '../auth';
import { getTableName, isLocal } from '../config';
import { getDocumentClient } from '../data/client';
import { folderEntity, videoEntity } from '../data/entities';
import {
  bulkDeleteSchema,
  bulkMoveSchema,
  publishVideoSchema,
  updateVideoSchema,
} from '../schemas';
import { buildSignedCookies } from '../signed-cookies';
import { rawKey } from '../storage';
import { deleteVideoCascade } from './cascade';
import { rootFolderId } from './folders';
import { currentUser, pathParam, requireVideoIdParam } from './request';
import { validate } from './validate';
import { asyncRouter } from './async-router';
import {
  conflictBody,
  failedItem,
  holdsLease,
  holderNameOf,
  leaseCondition,
  leaseDurationMs,
  serialiseVideo,
  videoKey,
  VideoItem,
} from './video-shared';

export { leaseDurationMs, serialiseVideo };

export const videosRouter = (): Router => {
  const router = asyncRouter();

  router.get('/', async (req: Request, res: Response) => {
    const folderId = (req.query.folderId as string | undefined) || 'ROOT';
    const isCreator = canViewDrafts(req.user?.role);

    const query = isCreator
      ? videoEntity.query.byFolder({ folderId })
      : videoEntity.query
          .byFolder({ folderId })
          // the empty recordedAt makes the prefix 'PUBLISHED#', so DRAFT can never match
          .begins({ statusKey: 'PUBLISHED', recordedAt: '' });

    const { data } = await query.go({ pages: 'all' });
    const items = (data as VideoItem[])
      .slice()
      .sort((a, b) => String(b.recordedAt).localeCompare(String(a.recordedAt)))
      .map(serialiseVideo);

    res.json({ items });
  });

  router.get('/all', async (req: Request, res: Response) => {
    const isCreator = canViewDrafts(req.user?.role);
    const { data: folders } = await folderEntity.query
      .all({})
      .go({ pages: 'all' });
    const folderIds = [rootFolderId, ...folders.map(({ id }) => id)];

    const lists = await Promise.all(
      folderIds.map(async (folderId) => {
        const query = isCreator
          ? videoEntity.query.byFolder({ folderId })
          : videoEntity.query
              .byFolder({ folderId })
              .begins({ statusKey: 'PUBLISHED', recordedAt: '' });
        const { data } = await query.go({ pages: 'all' });
        return data as VideoItem[];
      }),
    );

    const items = lists
      .flat()
      .sort((a, b) => String(b.recordedAt).localeCompare(String(a.recordedAt)))
      .map(serialiseVideo);

    res.json({ items });
  });

  router.post(
    '/bulk-move',
    requireCreator,
    validate(bulkMoveSchema),
    async (req: Request, res: Response) => {
      const { ids, folderId } = req.body as { ids: string[]; folderId: string };

      if (folderId !== rootFolderId) {
        const folder = await folderEntity.get({ id: folderId }).go();
        if (!folder.data) {
          res.status(404).json({ error: 'not_found' });
          return;
        }
      }

      const moved: string[] = [];
      const missing: string[] = [];

      const moveOne = async (id: string): Promise<void> => {
        const existing = await videoEntity.get({ id }).go();
        if (!existing.data) {
          missing.push(id);
          return;
        }
        // patch recomputes GSI1PK from folderId and leaves the rest of the item alone
        await videoEntity
          .patch({ id })
          .set({ folderId, updatedAt: new Date().toISOString() })
          .add({ version: 1 })
          .go();
        moved.push(id);
      };
      await ids.reduce(
        (chain, id) => chain.then(() => moveOne(id)),
        Promise.resolve(),
      );

      res.json({ moved, missing });
    },
  );

  router.post(
    '/bulk-delete',
    requireCreator,
    validate(bulkDeleteSchema),
    async (req: Request, res: Response) => {
      const { ids } = req.body as { ids: string[] };
      const deleted: string[] = [];
      const missing: string[] = [];
      const locked: string[] = [];

      const deleteOne = async (id: string): Promise<void> => {
        const existing = await videoEntity.get({ id }).go();
        if (!existing.data) {
          missing.push(id);
          return;
        }
        // a video someone else holds open is skipped rather than destroyed,
        // matching the single delete; an unheld video needs no lease
        const holder = existing.data.lockedBy;
        if (
          holder &&
          holder !== currentUser(req).sub &&
          typeof existing.data.lockExpiresAt === 'number' &&
          existing.data.lockExpiresAt > Date.now()
        ) {
          locked.push(id);
          return;
        }
        try {
          await deleteVideoCascade(id);
          deleted.push(id);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`failed to delete video ${id}`, error);
        }
      };
      await ids.reduce(
        (chain, id) => chain.then(() => deleteOne(id)),
        Promise.resolve(),
      );

      res.json({ deleted, missing, locked });
    },
  );

  const videoId = requireVideoIdParam('id');

  router.get('/:id', videoId, async (req: Request, res: Response) => {
    const { data } = await videoEntity.get({ id: pathParam(req, 'id') }).go();
    if (!data) {
      res.status(404).json({ error: 'not_found' });
      return;
    }
    if (!canViewDrafts(req.user?.role) && data.status !== 'published') {
      res.status(404).json({ error: 'not_found' });
      return;
    }
    res.json(serialiseVideo(data as VideoItem));
  });

  router.patch(
    '/:id',
    videoId,
    requireCreator,
    validate(updateVideoSchema),
    async (req: Request, res: Response) => {
      const id = pathParam(req, 'id');
      const { version, ...changes } = req.body as {
        version: number;
        title?: string;
        folderId?: string;
        chapters?: { startMs: number; title: string }[];
        recordedAt?: string;
      };

      const existing = await videoEntity.get({ id }).go();
      if (!existing.data) {
        res.status(404).json({ error: 'not_found' });
        return;
      }

      const now = Date.now();
      if (!holdsLease(existing.data as VideoItem, currentUser(req).sub, now)) {
        res.status(409).json({
          error: 'locked',
          ...(existing.data.lockedByName
            ? { holderName: existing.data.lockedByName }
            : {}),
        });
        return;
      }

      const next = {
        title: changes.title ?? existing.data.title,
        folderId: changes.folderId ?? existing.data.folderId,
        recordedAt: changes.recordedAt ?? existing.data.recordedAt,
        chapters: changes.chapters ?? existing.data.chapters,
      };

      // the whole item is rewritten so ElectroDB recomputes GSI1 when folderId or recordedAt move
      const params = videoEntity
        .put({
          ...existing.data,
          ...next,
          version: version + 1,
          updatedAt: new Date().toISOString(),
        })
        .params() as Record<string, unknown>;

      try {
        await getDocumentClient().send(
          new UpdateCommand({
            TableName: getTableName(),
            Key: videoKey(id),
            UpdateExpression:
              'SET #title = :title, #folderId = :folderId, #recordedAt = :recordedAt, #chapters = :chapters, #version = #version + :one, #updatedAt = :updatedAt, GSI1PK = :gsi1pk, GSI1SK = :gsi1sk',
            ConditionExpression: `${leaseCondition} AND #version = :expectedVersion`,
            ExpressionAttributeNames: {
              '#title': 'title',
              '#folderId': 'folderId',
              '#recordedAt': 'recordedAt',
              '#chapters': 'chapters',
              '#version': 'version',
              '#updatedAt': 'updatedAt',
            },
            ExpressionAttributeValues: {
              ':title': next.title,
              ':folderId': next.folderId,
              ':recordedAt': next.recordedAt,
              ':chapters': next.chapters,
              ':one': 1,
              ':updatedAt': new Date().toISOString(),
              ':sub': currentUser(req).sub,
              ':now': now,
              ':expectedVersion': version,
              ':gsi1pk': (params.Item as Record<string, string>).GSI1PK,
              ':gsi1sk': (params.Item as Record<string, string>).GSI1SK,
            },
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
          }),
        );
      } catch (error) {
        const item = failedItem(error);
        if (item) {
          res.status(409).json(conflictBody(item, currentUser(req).sub, now));
          return;
        }
        throw error;
      }

      const updated = await videoEntity.get({ id }).go();
      res.json({ video: serialiseVideo(updated.data as VideoItem) });
    },
  );

  router.post(
    '/:id/publish',
    videoId,
    requireCreator,
    validate(publishVideoSchema),
    async (req: Request, res: Response) => {
      const id = pathParam(req, 'id');
      const { version } = req.body as { version: number };

      const existing = await videoEntity.get({ id }).go();
      if (!existing.data) {
        res.status(404).json({ error: 'not_found' });
        return;
      }

      const now = Date.now();
      if (!holdsLease(existing.data as VideoItem, currentUser(req).sub, now)) {
        res.status(409).json({
          error: 'locked',
          ...(existing.data.lockedByName
            ? { holderName: existing.data.lockedByName }
            : {}),
        });
        return;
      }

      const params = videoEntity
        .put({
          ...existing.data,
          status: 'published',
          version: version + 1,
          updatedAt: new Date().toISOString(),
        })
        .params() as Record<string, unknown>;
      const item = params.Item as Record<string, string>;

      try {
        await getDocumentClient().send(
          new UpdateCommand({
            TableName: getTableName(),
            Key: videoKey(id),
            UpdateExpression:
              'SET #status = :status, statusKey = :statusKey, #version = #version + :one, #updatedAt = :updatedAt, GSI1PK = :gsi1pk, GSI1SK = :gsi1sk',
            ConditionExpression: `${leaseCondition} AND #version = :expectedVersion`,
            ExpressionAttributeNames: {
              '#status': 'status',
              '#version': 'version',
              '#updatedAt': 'updatedAt',
            },
            ExpressionAttributeValues: {
              ':status': 'published',
              ':statusKey': 'PUBLISHED',
              ':one': 1,
              ':updatedAt': new Date().toISOString(),
              ':sub': currentUser(req).sub,
              ':now': now,
              ':expectedVersion': version,
              ':gsi1pk': item.GSI1PK,
              ':gsi1sk': item.GSI1SK,
            },
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
          }),
        );
      } catch (error) {
        const failed = failedItem(error);
        if (failed) {
          res.status(409).json(conflictBody(failed, currentUser(req).sub, now));
          return;
        }
        throw error;
      }

      const updated = await videoEntity.get({ id }).go();
      res.json({ video: serialiseVideo(updated.data as VideoItem) });
    },
  );

  router.post(
    '/:id/unpublish',
    videoId,
    requireCreator,
    validate(publishVideoSchema),
    async (req: Request, res: Response) => {
      const id = pathParam(req, 'id');
      const { version } = req.body as { version: number };

      const existing = await videoEntity.get({ id }).go();
      if (!existing.data) {
        res.status(404).json({ error: 'not_found' });
        return;
      }

      const now = Date.now();
      if (!holdsLease(existing.data as VideoItem, currentUser(req).sub, now)) {
        res.status(409).json({
          error: 'locked',
          ...(existing.data.lockedByName
            ? { holderName: existing.data.lockedByName }
            : {}),
        });
        return;
      }

      const params = videoEntity
        .put({
          ...existing.data,
          status: 'draft',
          version: version + 1,
          updatedAt: new Date().toISOString(),
        })
        .params() as Record<string, unknown>;
      const item = params.Item as Record<string, string>;

      try {
        await getDocumentClient().send(
          new UpdateCommand({
            TableName: getTableName(),
            Key: videoKey(id),
            UpdateExpression:
              'SET #status = :status, statusKey = :statusKey, #version = #version + :one, #updatedAt = :updatedAt, GSI1PK = :gsi1pk, GSI1SK = :gsi1sk',
            ConditionExpression: `${leaseCondition} AND #version = :expectedVersion`,
            ExpressionAttributeNames: {
              '#status': 'status',
              '#version': 'version',
              '#updatedAt': 'updatedAt',
            },
            ExpressionAttributeValues: {
              ':status': 'draft',
              ':statusKey': 'DRAFT',
              ':one': 1,
              ':updatedAt': new Date().toISOString(),
              ':sub': currentUser(req).sub,
              ':now': now,
              ':expectedVersion': version,
              ':gsi1pk': item.GSI1PK,
              ':gsi1sk': item.GSI1SK,
            },
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
          }),
        );
      } catch (error) {
        const failed = failedItem(error);
        if (failed) {
          res.status(409).json(conflictBody(failed, currentUser(req).sub, now));
          return;
        }
        throw error;
      }

      const updated = await videoEntity.get({ id }).go();
      res.json({ video: serialiseVideo(updated.data as VideoItem) });
    },
  );

  router.post('/:id/lease', videoId, requireCreator, async (req, res) => {
    const id = pathParam(req, 'id');
    const now = Date.now();
    const lockExpiresAt = now + leaseDurationMs;

    try {
      await getDocumentClient().send(
        new UpdateCommand({
          TableName: getTableName(),
          Key: videoKey(id),
          UpdateExpression:
            'SET lockedBy = :sub, lockedByName = :name, lockExpiresAt = :expires',
          ConditionExpression:
            'attribute_not_exists(lockedBy) OR lockedBy = :sub OR lockExpiresAt < :now',
          ExpressionAttributeValues: {
            ':sub': currentUser(req).sub,
            ':name': currentUser(req).name,
            ':expires': lockExpiresAt,
            ':now': now,
          },
          ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
        }),
      );
    } catch (error) {
      const failed = failedItem(error);
      if (failed) {
        res.status(409).json({
          error: 'locked',
          ...(holderNameOf(failed) ? { holderName: holderNameOf(failed) } : {}),
        });
        return;
      }
      throw error;
    }

    res.json({
      lockedBy: currentUser(req).sub,
      lockedByName: currentUser(req).name,
      lockExpiresAt: new Date(lockExpiresAt).toISOString(),
    });
  });

  router.delete('/:id/lease', videoId, requireCreator, async (req, res) => {
    try {
      await getDocumentClient().send(
        new UpdateCommand({
          TableName: getTableName(),
          Key: videoKey(pathParam(req, 'id')),
          UpdateExpression: 'REMOVE lockedBy, lockedByName, lockExpiresAt',
          ConditionExpression: 'lockedBy = :sub',
          ExpressionAttributeValues: { ':sub': currentUser(req).sub },
        }),
      );
    } catch (error) {
      if (!(error instanceof ConditionalCheckFailedException)) {
        throw error;
      }
    }
    res.status(204).end();
  });

  router.delete('/:id', videoId, requireCreator, async (req, res) => {
    const id = pathParam(req, 'id');

    const existing = await videoEntity.get({ id }).go();
    if (!existing.data) {
      res.status(204).end();
      return;
    }

    // deleting destroys the row and its media, so it needs the same lease the
    // other writes take; otherwise a second creator can wipe a demo mid-edit
    if (
      !holdsLease(existing.data as VideoItem, currentUser(req).sub, Date.now())
    ) {
      res.status(409).json({
        error: 'locked',
        ...(existing.data.lockedByName
          ? { holderName: existing.data.lockedByName }
          : {}),
      });
      return;
    }

    await deleteVideoCascade(id);
    res.status(204).end();
  });

  router.post('/:id/access', videoId, async (req, res) => {
    const id = pathParam(req, 'id');
    const { data } = await videoEntity.get({ id }).go();
    if (!data) {
      res.status(404).json({ error: 'not_found' });
      return;
    }
    if (!canViewDrafts(req.user?.role) && data.status !== 'published') {
      res.status(403).json({ error: 'forbidden' });
      return;
    }

    if (!isLocal()) {
      const cookies = await buildSignedCookies(id);
      cookies.forEach(({ name, value }) => {
        res.cookie(name, value, {
          path: `/media/${id}/`,
          secure: true,
          httpOnly: true,
          sameSite: 'lax',
        });
      });
    }

    res.json({
      streamUrl: `/media/${id}/stream.mp4`,
      spriteUrl: `/media/${id}/sprite.jpg`,
      thumbnailsVttUrl: `/media/${id}/thumbnails.vtt`,
    });
  });

  return router;
};

export { rawKey };
