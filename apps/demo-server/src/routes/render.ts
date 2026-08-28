import { parseTimeline, serialiseTimeline } from '@asap-hub/demo-timeline';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { Response, Router } from 'express';
import { v4 as uuid } from 'uuid';
import { getTableName } from '../config';
import { getDocumentClient } from '../data/client';
import { videoEntity } from '../data/entities';
import { getJobRunner } from '../jobs/runner';
import { cancelRenderSchema, startRenderSchema } from '../schemas';
import {
  getObjectText,
  projectPrefix,
  putObject,
  renderLifecycleTag,
} from '../storage';
import { currentUser, pathParam, requireVideoIdParam } from './request';
import { validate } from './validate';
import {
  applyGuardedUpdate,
  guardedUpdate,
  loadProject,
  serialiseVideo,
  videoKey,
  VideoItem,
} from './video-shared';

export type RenderState = {
  renderId: string;
  state: 'queued' | 'rendering' | 'done' | 'failed' | 'cancelled';
  timelineVersion: number;
  stage?: string;
  progress?: number;
  taskArn?: string;
  requestedAt?: string;
  finishedAt?: string;
  error?: string;
};

const activeStates = ['queued', 'rendering'];

// a task killed without reporting leaves 'rendering' on the row for ever, and
// nothing else ever clears it, so an active render past the longest one the
// container could plausibly still be running counts as over
export const maxRenderAgeMs = 4 * 60 * 60 * 1000;

export const isRenderActive = (
  render?: RenderState,
  now: number = Date.now(),
): boolean => {
  if (!render || !activeStates.includes(render.state)) {
    return false;
  }
  const requestedAt = Date.parse(render.requestedAt ?? '');
  return Number.isNaN(requestedAt) || now - requestedAt < maxRenderAgeMs;
};

// a render writes to media/{id}/{mediaPath}/, so each one gets its own directory
// and a re-render is not hidden behind the day-long CloudFront TTL on the last
export const nextMediaPath = (current?: string): string => {
  const revision = /^r(\d+)$/.exec(current ?? '')?.[1];
  return `r${revision ? Number(revision) + 1 : 1}`;
};

export const renderTimelineKey = (videoId: string, renderId: string): string =>
  `${projectPrefix(videoId)}renders/${renderId}/timeline.json`;

const renderOf = (project: VideoItem): RenderState | undefined =>
  project.render as RenderState | undefined;

// the render map this request built is stale the moment the container starts
// writing progress into it, so only the one field this write knows about moves,
// and only while the row still names this run
const recordTaskArn = async (
  id: string,
  renderId: string,
  taskArn: string,
): Promise<void> => {
  try {
    await getDocumentClient().send(
      new UpdateCommand({
        TableName: getTableName(),
        Key: videoKey(id),
        UpdateExpression: 'SET #render.#taskArn = :taskArn ADD #version :one',
        ConditionExpression: '#render.#renderId = :renderId',
        ExpressionAttributeNames: {
          '#render': 'render',
          '#taskArn': 'taskArn',
          '#renderId': 'renderId',
          '#version': 'version',
        },
        ExpressionAttributeValues: {
          ':taskArn': taskArn,
          ':renderId': renderId,
          ':one': 1,
        },
      }),
    );
  } catch (error) {
    if (!(error instanceof ConditionalCheckFailedException)) {
      throw error;
    }
    // eslint-disable-next-line no-console
    console.error(`the row for ${id} no longer names the render ${renderId}`);
  }
};

const timelinePointerOf = (
  project: VideoItem,
): { key: string; timelineVersion: number } | undefined =>
  project.timeline as { key: string; timelineVersion: number } | undefined;

export const registerRenderRoutes = (router: Router): void => {
  const videoId = requireVideoIdParam('id');

  const respondWithVideo = async (res: Response, id: string): Promise<void> => {
    const { data } = await videoEntity.get({ id }).go();
    res.json({ video: serialiseVideo(data as VideoItem) });
  };

  router.post(
    '/:id/render',
    videoId,
    validate(startRenderSchema),
    async (req, res) => {
      const project = await loadProject(req, res);
      if (!project) {
        return;
      }

      if (isRenderActive(renderOf(project))) {
        res.status(409).json({ error: 'render_active' });
        return;
      }

      const pointer = timelinePointerOf(project);
      const timeline = pointer
        ? parseTimeline(JSON.parse(await getObjectText(pointer.key)))
        : undefined;
      if (!timeline || !pointer || timeline.clips.length === 0) {
        res.status(400).json({ error: 'empty_timeline' });
        return;
      }

      const id = pathParam(req, 'id');
      const { version } = req.body as { version: number };
      const { sub } = currentUser(req);
      const renderId = uuid();
      const timelineKey = renderTimelineKey(id, renderId);

      // the container renders this snapshot, so an edit saved while the job runs
      // cannot change what comes out of it
      await putObject(
        timelineKey,
        serialiseTimeline(timeline),
        'application/json',
        renderLifecycleTag,
      );

      const requestedAt = new Date().toISOString();
      const render: RenderState = {
        renderId,
        state: 'queued',
        timelineVersion: pointer.timelineVersion,
        progress: 0,
        requestedAt,
      };

      const queued = await applyGuardedUpdate(res, {
        id,
        sub,
        now: Date.now(),
        expectedVersion: version,
        // chapters are not written here: they describe the media, so the
        // container writes them with it when the render lands. Writing them now
        // would retitle a published demo the moment an export was started, even
        // if that export then failed or was cancelled.
        set: { render, updatedAt: requestedAt },
      });
      if (!queued) {
        return;
      }

      let jobId: string;
      try {
        ({ jobId } = await getJobRunner().run('render', {
          JOB: 'render',
          VIDEO_ID: id,
          RENDER_ID: renderId,
          TIMELINE_KEY: timelineKey,
          MEDIA_PATH: nextMediaPath(project.mediaPath as string | undefined),
        }));
      } catch (error) {
        // a render nobody started must not sit queued, blocking every later one
        await guardedUpdate({
          id,
          sub,
          now: Date.now(),
          expectedVersion: version + 1,
          set: {
            render: {
              ...render,
              state: 'failed',
              error: 'the render job could not be started',
              finishedAt: new Date().toISOString(),
            },
          },
        }).catch(() => undefined);
        // eslint-disable-next-line no-console
        console.error(`could not start the render job for ${id}`, error);
        res.status(502).json({ error: 'render_start_failed' });
        return;
      }

      await recordTaskArn(id, renderId, jobId);

      await respondWithVideo(res, id);
    },
  );

  router.delete(
    '/:id/render',
    videoId,
    validate(cancelRenderSchema),
    async (req, res) => {
      const project = await loadProject(req, res);
      if (!project) {
        return;
      }

      const render = renderOf(project);
      if (!render || !isRenderActive(render)) {
        res.status(409).json({ error: 'render_inactive' });
        return;
      }

      if (render.taskArn) {
        // the task may already be gone; the item is what the editor believes
        await getJobRunner()
          .stop(render.taskArn)
          .catch((error: unknown) => {
            // eslint-disable-next-line no-console
            console.error(
              `could not stop the render task ${render.taskArn}`,
              error,
            );
          });
      }

      const id = pathParam(req, 'id');
      const { version } = req.body as { version: number };
      const finishedAt = new Date().toISOString();

      const cancelled = await applyGuardedUpdate(res, {
        id,
        sub: currentUser(req).sub,
        now: Date.now(),
        expectedVersion: version,
        set: {
          render: { ...render, state: 'cancelled', finishedAt },
          updatedAt: finishedAt,
        },
      });
      if (!cancelled) {
        return;
      }

      await respondWithVideo(res, id);
    },
  );
};
