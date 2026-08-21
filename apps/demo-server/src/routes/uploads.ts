import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { requireCreator } from '../auth';
import { isLocal } from '../config';
import { videoEntity } from '../data/entities';
import { startLocalEncode } from '../local-encoder';
import {
  completeUploadSchema,
  createUploadSchema,
  uploadPartsSchema,
} from '../schemas';
import {
  abortMultipartUpload,
  abortMultipartUploadsUnder,
  completeMultipartUpload,
  createMultipartUpload,
  deletePrefix,
  signUploadParts,
} from '../storage';
import { serialiseVideo } from './videos';
import { currentUser, pathParam, requireVideoIdParam } from './request';
import { validate } from './validate';
import { asyncRouter } from './async-router';

export const partSize = 10485760;

export const uploadsRouter = (): Router => {
  const router = asyncRouter();

  router.use(requireCreator);

  router.post('/', validate(createUploadSchema), async (req, res) => {
    const { title, folderId, recordedAt } = req.body as {
      title: string;
      folderId?: string;
      recordedAt?: string;
    };
    const videoId = uuid();
    const now = new Date().toISOString();

    await videoEntity
      .create({
        id: videoId,
        title,
        status: 'draft',
        folderId: folderId ?? 'ROOT',
        recordedAt: recordedAt ?? now,
        durationMs: 0,
        chapters: [],
        s3Prefix: videoId,
        createdBy: { sub: currentUser(req).sub, name: currentUser(req).name },
        version: 1,
        processingState: 'uploading',
        createdAt: now,
        updatedAt: now,
      })
      .go();

    const { uploadId, key } = await createMultipartUpload(videoId);
    res.json({ videoId, uploadId, key, partSize });
  });

  // signing a part URL hands out write access to raw/<videoId>/original.mp4,
  // so it is only granted while that row is still mid-upload; otherwise any
  // creator could overwrite the source of an already published video
  const uploadInProgress = async (videoId: string): Promise<boolean> => {
    const { data } = await videoEntity.get({ id: videoId }).go();
    return !!data && data.processingState === 'uploading';
  };

  router.post(
    '/:videoId/parts',
    requireVideoIdParam('videoId'),
    validate(uploadPartsSchema),
    async (req, res) => {
      const videoId = pathParam(req, 'videoId');
      if (!(await uploadInProgress(videoId))) {
        res.status(404).json({ error: 'not_found' });
        return;
      }
      const { uploadId, partNumbers } = req.body as {
        uploadId: string;
        partNumbers: number[];
      };
      const urls = await signUploadParts(videoId, uploadId, partNumbers);
      res.json({ urls });
    },
  );

  router.post(
    '/:videoId/complete',
    requireVideoIdParam('videoId'),
    validate(completeUploadSchema),
    async (req, res) => {
      const videoId = pathParam(req, 'videoId');
      if (!(await uploadInProgress(videoId))) {
        res.status(404).json({ error: 'not_found' });
        return;
      }
      const { uploadId, parts } = req.body as {
        uploadId: string;
        parts: { partNumber: number; eTag: string }[];
      };

      await completeMultipartUpload(videoId, uploadId, parts);

      const { data } = await videoEntity
        .patch({ id: videoId })
        .set({
          processingState: 'processing',
          updatedAt: new Date().toISOString(),
        })
        .go({ response: 'all_new' });

      if (isLocal()) {
        startLocalEncode(videoId);
      }

      res.json({ video: serialiseVideo(data as Record<string, unknown>) });
    },
  );

  router.delete(
    '/:videoId',
    requireVideoIdParam('videoId'),
    async (req, res) => {
      const videoId = pathParam(req, 'videoId');
      const { uploadId } = req.query;
      if (typeof uploadId === 'string' && uploadId) {
        await abortMultipartUpload(videoId, uploadId).catch(() => undefined);
      }
      const { data } = await videoEntity.get({ id: videoId }).go();
      if (data?.processingState === 'uploading') {
        // a retried upload can leave earlier attempts open on the same key and
        // the client only ever knows the id of its own latest one
        await abortMultipartUploadsUnder(`raw/${videoId}/`).catch(
          () => undefined,
        );
        await deletePrefix(`raw/${videoId}/`).catch(() => undefined);
        await videoEntity.delete({ id: videoId }).go();
      }
      res.status(204).end();
    },
  );

  return router;
};
