import {
  parseTimeline,
  resolveChapters,
  serialiseTimeline,
} from '@asap-hub/demo-timeline';
import { Response, Router } from 'express';
import { v4 as uuid } from 'uuid';
import { videoEntity } from '../data/entities';
import { getJobRunner } from '../jobs/runner';
import { cancelRenderSchema, startRenderSchema } from '../schemas';
import { getObjectText, projectPrefix, putObject } from '../storage';
import { currentUser, pathParam, requireVideoIdParam } from './request';
import { validate } from './validate';
import {
  applyGuardedUpdate,
  guardedUpdate,
  loadProject,
  serialiseVideo,
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

export const isRenderActive = (render?: RenderState): boolean =>
  Boolean(render && activeStates.includes(render.state));

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
        // the watch page reads chapters off the item, so they are resolved from
        // the snapshot being rendered rather than after the fact
        set: {
          render,
          chapters: resolveChapters(timeline),
          updatedAt: requestedAt,
        },
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

      const tracked = await applyGuardedUpdate(res, {
        id,
        sub,
        now: Date.now(),
        expectedVersion: version + 1,
        set: { render: { ...render, taskArn: jobId } },
      });
      if (!tracked) {
        return;
      }

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
