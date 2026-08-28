import { parseTimeline } from '@asap-hub/demo-timeline';
import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { assetEntity } from '../data/entities';
import { getJobRunner } from '../jobs/runner';
import {
  assetPartsSchema,
  completeAssetSchema,
  createAssetSchema,
  renameAssetSchema,
} from '../schemas';
import {
  abortMultipartUploadsUnder,
  assetKey,
  assetPrefix,
  completeMultipartUpload,
  createMultipartUpload,
  deletePrefix,
  getObjectText,
  partSize,
  signUploadParts,
} from '../storage';
import { pathParam, requireVideoIdParam } from './request';
import { validate } from './validate';
import { loadProject, VideoItem } from './video-shared';

export type AssetItem = Record<string, unknown>;

// the editor plays the proxy once the ingest has written one, and the original
// until then; the storage key itself never crosses the wire
const playableUrl = (item: AssetItem): string | undefined => {
  const key = (item.proxyKey ?? item.key) as string | undefined;
  return key ? `/${key}` : undefined;
};

export const serialiseAsset = (item: AssetItem) => ({
  assetId: item.assetId,
  kind: item.kind,
  state: item.state,
  mimeType: item.mimeType,
  label: item.label,
  ...(playableUrl(item) ? { url: playableUrl(item) } : {}),
  ...(item.bytes !== undefined ? { bytes: item.bytes } : {}),
  ...(item.durationMs !== undefined ? { durationMs: item.durationMs } : {}),
  ...(item.width !== undefined ? { width: item.width } : {}),
  ...(item.height !== undefined ? { height: item.height } : {}),
  ...(item.fps !== undefined ? { fps: item.fps } : {}),
  ...(item.hasAudio !== undefined ? { hasAudio: item.hasAudio } : {}),
  ...(item.proxyKey !== undefined ? { proxyKey: item.proxyKey } : {}),
  ...(item.error !== undefined ? { error: item.error } : {}),
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const referencedAssetIds = async (project: VideoItem): Promise<Set<string>> => {
  const pointer = project.timeline as { key: string } | undefined;
  if (!pointer) {
    return new Set();
  }

  const timeline = parseTimeline(JSON.parse(await getObjectText(pointer.key)));
  return new Set([
    ...timeline.clips.flatMap((clip) =>
      clip.kind === 'source' ? [clip.assetId] : [],
    ),
    ...timeline.narration.map((clip) => clip.assetId),
  ]);
};

export const registerAssetRoutes = (router: Router): void => {
  const videoId = requireVideoIdParam('id');
  // an asset id is concatenated into an S3 key just like a video id is
  const assetId = requireVideoIdParam('assetId');

  // handing out a signed part URL, or completing the upload behind it, is write
  // access to the asset key, so it is only granted while the row is mid-upload;
  // otherwise any creator could overwrite a source an edit already depends on
  const uploadingAsset = async (
    videoIdValue: string,
    assetIdValue: string,
  ): Promise<AssetItem | undefined> => {
    const { data } = await assetEntity
      .get({ videoId: videoIdValue, assetId: assetIdValue })
      .go();
    return data?.state === 'uploading' ? data : undefined;
  };

  router.get('/:id/assets', videoId, async (req, res) => {
    const project = await loadProject(req, res);
    if (!project) {
      return;
    }

    const { data } = await assetEntity.query
      .byVideo({ videoId: pathParam(req, 'id') })
      .go({ pages: 'all' });

    res.json({ assets: data.map(serialiseAsset) });
  });

  router.post(
    '/:id/assets',
    videoId,
    validate(createAssetSchema),
    async (req, res) => {
      const project = await loadProject(req, res);
      if (!project) {
        return;
      }

      const { kind, mimeType, label, extension } = req.body as {
        kind: 'video' | 'audio';
        mimeType: string;
        label: string;
        extension: string;
      };
      const id = pathParam(req, 'id');
      const newAssetId = uuid();
      const key = assetKey(id, newAssetId, extension);
      const now = new Date().toISOString();

      await assetEntity
        .create({
          videoId: id,
          assetId: newAssetId,
          kind,
          state: 'uploading',
          key,
          mimeType,
          label,
          createdAt: now,
          updatedAt: now,
        })
        .go();

      const { uploadId } = await createMultipartUpload(key, mimeType);

      res.json({ assetId: newAssetId, uploadId, key, partSize });
    },
  );

  router.post(
    '/:id/assets/:assetId/parts',
    videoId,
    assetId,
    validate(assetPartsSchema),
    async (req, res) => {
      const project = await loadProject(req, res);
      if (!project) {
        return;
      }

      const asset = await uploadingAsset(
        pathParam(req, 'id'),
        pathParam(req, 'assetId'),
      );
      if (!asset) {
        res.status(404).json({ error: 'not_found' });
        return;
      }

      const { uploadId, partNumbers } = req.body as {
        uploadId: string;
        partNumbers: number[];
      };
      const urls = await signUploadParts(
        asset.key as string,
        uploadId,
        partNumbers,
      );

      res.json({ urls });
    },
  );

  router.post(
    '/:id/assets/:assetId/complete',
    videoId,
    assetId,
    validate(completeAssetSchema),
    async (req, res) => {
      const project = await loadProject(req, res);
      if (!project) {
        return;
      }

      const id = pathParam(req, 'id');
      const currentAssetId = pathParam(req, 'assetId');
      const asset = await uploadingAsset(id, currentAssetId);
      if (!asset) {
        res.status(404).json({ error: 'not_found' });
        return;
      }

      const { uploadId, parts } = req.body as {
        uploadId: string;
        parts: { partNumber: number; eTag: string }[];
      };
      await completeMultipartUpload(asset.key as string, uploadId, parts);

      const { data } = await assetEntity
        .patch({ videoId: id, assetId: currentAssetId })
        .set({ state: 'preparing', updatedAt: new Date().toISOString() })
        .go({ response: 'all_new' });

      // the ingest job writes proxy.mp4 and fills in the probed duration and
      // dimensions; a job that cannot start must not fail the upload, but the
      // asset has to say so rather than sit in 'preparing' for ever, because a
      // clip with no probed length cannot be trimmed back out again
      void getJobRunner()
        .run('ingest', {
          VIDEO_ID: id,
          ASSET_ID: currentAssetId,
          ASSET_KEY: asset.key as string,
        })
        .catch(async (error: unknown) => {
          // eslint-disable-next-line no-console
          console.error(
            `could not start the ingest job for asset ${currentAssetId}`,
            error,
          );
          await assetEntity
            .patch({ videoId: id, assetId: currentAssetId })
            .set({
              state: 'failed',
              error: 'the file could not be prepared for editing',
              updatedAt: new Date().toISOString(),
            })
            .go()
            .catch(() => undefined);
        });

      res.json({ asset: serialiseAsset(data as AssetItem) });
    },
  );

  // the label is the creator's name for the source, not the file's: a recording
  // arrives called "Screen recording 05:41 AM" and only they know what it is
  router.patch(
    '/:id/assets/:assetId',
    videoId,
    assetId,
    validate(renameAssetSchema),
    async (req, res) => {
      const project = await loadProject(req, res);
      if (!project) {
        return;
      }

      const { label } = req.body as { label: string };
      const { data } = await assetEntity
        .patch({
          videoId: pathParam(req, 'id'),
          assetId: pathParam(req, 'assetId'),
        })
        .set({ label, updatedAt: new Date().toISOString() })
        .go({ response: 'all_new' })
        .catch(() => ({ data: undefined }));

      if (!data) {
        res.status(404).json({ error: 'not_found' });
        return;
      }

      res.json({ asset: serialiseAsset(data as AssetItem) });
    },
  );

  router.delete('/:id/assets/:assetId', videoId, assetId, async (req, res) => {
    const project = await loadProject(req, res);
    if (!project) {
      return;
    }

    const id = pathParam(req, 'id');
    const currentAssetId = pathParam(req, 'assetId');
    if ((await referencedAssetIds(project)).has(currentAssetId)) {
      res.status(409).json({ error: 'asset_in_use' });
      return;
    }

    // aborting first: a part that lands between the list and the delete would
    // otherwise be completed into an object nothing is left to clean up
    const prefix = assetPrefix(id, currentAssetId);
    await abortMultipartUploadsUnder(prefix);
    await deletePrefix(prefix);
    await assetEntity.delete({ videoId: id, assetId: currentAssetId }).go();

    res.status(204).end();
  });
};
