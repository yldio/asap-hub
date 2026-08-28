import { parseTimeline } from '@asap-hub/demo-timeline';
import { Request, Response, Router } from 'express';
import { Readable } from 'stream';
import { v4 as uuid } from 'uuid';
import { assetEntity } from '../data/entities';
import {
  assetPartsSchema,
  completeAssetSchema,
  createAssetSchema,
} from '../schemas';
import {
  abortMultipartUploadsUnder,
  assetKey,
  assetPrefix,
  completeMultipartUpload,
  createMultipartUpload,
  deletePrefix,
  getObject,
  partSize,
  signUploadParts,
} from '../storage';
import { pathParam, requireVideoIdParam } from './request';
import { validate } from './validate';
import { VideoItem } from './video-shared';

export type AssetItem = Record<string, unknown>;

type LoadProject = (
  req: Request,
  res: Response,
) => Promise<VideoItem | undefined>;

export const serialiseAsset = (item: AssetItem) => ({
  assetId: item.assetId,
  kind: item.kind,
  state: item.state,
  mimeType: item.mimeType,
  label: item.label,
  ...(item.bytes !== undefined ? { bytes: item.bytes } : {}),
  ...(item.durationMs !== undefined ? { durationMs: item.durationMs } : {}),
  ...(item.width !== undefined ? { width: item.width } : {}),
  ...(item.height !== undefined ? { height: item.height } : {}),
  ...(item.proxyKey !== undefined ? { proxyKey: item.proxyKey } : {}),
  ...(item.error !== undefined ? { error: item.error } : {}),
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

const readStream = (stream: Readable): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    stream.on('error', reject);
  });

const referencedAssetIds = async (project: VideoItem): Promise<Set<string>> => {
  const pointer = project.timeline as { key: string } | undefined;
  if (!pointer) {
    return new Set();
  }

  const { body } = await getObject(pointer.key);
  const timeline = parseTimeline(JSON.parse(await readStream(body)));
  return new Set([
    ...timeline.clips.flatMap((clip) =>
      clip.kind === 'source' ? [clip.assetId] : [],
    ),
    ...timeline.narration.map((clip) => clip.assetId),
  ]);
};

export const registerAssetRoutes = (
  router: Router,
  loadProject: LoadProject,
): void => {
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

      // 'preparing' is where the ingest job that writes proxy.mp4 and fills in the
      // probed duration and dimensions will be queued, in a later change
      const { data } = await assetEntity
        .patch({ videoId: id, assetId: currentAssetId })
        .set({ state: 'preparing', updatedAt: new Date().toISOString() })
        .go({ response: 'all_new' });

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
