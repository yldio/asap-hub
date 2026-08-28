import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { Request, Response, Router } from 'express';
import { requireCreator } from '../auth';
import { getDemoHostname } from '../config';
import { recordingSessionEntity, videoEntity } from '../data/entities';
import { finaliseRecordingSchema, maxCaptureBatchEvents } from '../schemas';
import {
  deletePrefix,
  getObjectText,
  projectPrefix,
  putObject,
} from '../storage';
import { asyncRouter } from './async-router';
import { currentUser, pathParam, requireVideoIdParam } from './request';
import { validate } from './validate';
import { VideoItem } from './video-shared';

export const captureSessionPrefix = (
  videoId: string,
  sessionId: string,
): string => `${projectPrefix(videoId)}capture/${sessionId}/`;

export const capturePartsPrefix = (
  videoId: string,
  sessionId: string,
): string => `${captureSessionPrefix(videoId, sessionId)}parts/`;

export const capturePartKey = (
  videoId: string,
  sessionId: string,
  seq: number,
): string => `${capturePartsPrefix(videoId, sessionId)}${seq}.ndjson`;

export const captureEventsKey = (videoId: string, sessionId: string): string =>
  `${captureSessionPrefix(videoId, sessionId)}events.ndjson`;

export const ndjsonContentType = 'application/x-ndjson';

// a take is a demo, not a day: a token that leaks is worthless soon after
export const sessionTtlMs = 4 * 60 * 60 * 1000;

export const captureQuota = {
  events: 200000,
  parts: 500,
  batchEvents: maxCaptureBatchEvents,
};

export const hashCaptureToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');

export const captureTokenMatches = (
  token: string,
  tokenHash: string,
): boolean => {
  const provided = Buffer.from(hashCaptureToken(token), 'hex');
  const stored = Buffer.from(tokenHash, 'hex');
  return provided.length === stored.length && timingSafeEqual(provided, stored);
};

export type RecordingSessionItem = {
  sessionId: string;
  videoId: string;
  tokenHash: string;
  state: 'open' | 'closed';
  eventCount: number;
  lastSeq: number;
  parts: number[];
  lastEventAt?: string;
  expiresAt: number;
  startedAtEpochMs?: number;
  stoppedAtEpochMs?: number;
  eventsKey?: string;
};

// deployed, the app and the api share one CloudFront distribution, and locally
// the vite dev server proxies /api, so one origin serves the snippet and the
// endpoint it posts to
const appOrigin = (): string => {
  const hostname = getDemoHostname();
  return hostname ? `https://${hostname}` : 'http://localhost:3500';
};

const loadSession = async (
  sessionId: string,
): Promise<RecordingSessionItem | undefined> => {
  const { data } = await recordingSessionEntity.get({ sessionId }).go();
  return (data as RecordingSessionItem | null) ?? undefined;
};

const reportedState = (session: RecordingSessionItem): string =>
  session.state === 'open' && session.expiresAt <= Date.now()
    ? 'expired'
    : session.state;

// a recording only ever hangs off a studio project, so a plain upload and a
// missing row are the same 404, exactly as the project routes answer
const loadProject = async (
  req: Request,
  res: Response,
): Promise<VideoItem | undefined> => {
  const { data } = await videoEntity.get({ id: pathParam(req, 'id') }).go();
  if (!data || data.kind !== 'studio') {
    res.status(404).json({ error: 'not_found' });
    return undefined;
  }
  return data as VideoItem;
};

export const recordingsRouter = (): Router => {
  const router = asyncRouter();
  const videoId = requireVideoIdParam('id');
  const sessionId = requireVideoIdParam('sessionId');

  router.use(requireCreator);

  // the session the request names, only if it belongs to this project
  const loadProjectSession = async (
    req: Request,
    res: Response,
  ): Promise<RecordingSessionItem | undefined> => {
    const project = await loadProject(req, res);
    if (!project) {
      return undefined;
    }
    const session = await loadSession(pathParam(req, 'sessionId'));
    if (!session || session.videoId !== pathParam(req, 'id')) {
      res.status(404).json({ error: 'not_found' });
      return undefined;
    }
    return session;
  };

  router.post('/:id/recordings', videoId, async (req, res) => {
    const project = await loadProject(req, res);
    if (!project) {
      return;
    }

    const id = pathParam(req, 'id');
    const newSessionId = randomBytes(16).toString('hex');
    // base64url so the token survives the snippet's `#session.token` fragment
    const token = randomBytes(32).toString('base64url');
    const now = Date.now();
    const timestamp = new Date(now).toISOString();

    await recordingSessionEntity
      .create({
        sessionId: newSessionId,
        videoId: id,
        tokenHash: hashCaptureToken(token),
        state: 'open',
        eventCount: 0,
        lastSeq: 0,
        parts: [],
        expiresAt: now + sessionTtlMs,
        createdBy: {
          sub: currentUser(req).sub,
          name: currentUser(req).name,
        },
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .go();

    res.status(201).json({
      sessionId: newSessionId,
      token,
      // the credentials ride in the fragment, which no proxy, referrer or
      // access log along the way ever sees
      snippetUrl: `${appOrigin()}/capture/v1.js#${newSessionId}.${token}`,
      captureUrl: `${appOrigin()}/api/capture`,
      expiresAt: new Date(now + sessionTtlMs).toISOString(),
    });
  });

  router.get(
    '/:id/recordings/:sessionId',
    videoId,
    sessionId,
    async (req, res) => {
      const session = await loadProjectSession(req, res);
      if (!session) {
        return;
      }

      res.json({
        state: reportedState(session),
        eventCount: session.eventCount,
        lastEventAt: session.lastEventAt ?? null,
      });
    },
  );

  // the editor reads the immutable stream back to derive effects from it
  router.get(
    '/:id/recordings/:sessionId/events',
    videoId,
    sessionId,
    async (req, res) => {
      const session = await loadProjectSession(req, res);
      if (!session) {
        return;
      }
      if (!session.eventsKey) {
        res.status(409).json({ error: 'not_finalised' });
        return;
      }

      res.type(ndjsonContentType).send(await getObjectText(session.eventsKey));
    },
  );

  router.post(
    '/:id/recordings/:sessionId/finalise',
    videoId,
    sessionId,
    validate(finaliseRecordingSchema),
    async (req, res) => {
      const session = await loadProjectSession(req, res);
      if (!session) {
        return;
      }
      if (session.state !== 'open') {
        res.status(409).json({ error: 'already_finalised' });
        return;
      }

      const { startedAtEpochMs, stoppedAtEpochMs } = req.body as {
        startedAtEpochMs: number;
        stoppedAtEpochMs: number;
      };
      const id = pathParam(req, 'id');
      const currentSessionId = pathParam(req, 'sessionId');

      const seqs = Array.from(new Set(session.parts)).sort((a, b) => a - b);
      const bodies = await Promise.all(
        seqs.map((seq) =>
          // a batch that never landed must not sink the whole recording
          getObjectText(capturePartKey(id, currentSessionId, seq)).catch(
            () => '',
          ),
        ),
      );
      const lines = bodies
        .flatMap((body) => body.split('\n'))
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const key = captureEventsKey(id, currentSessionId);
      await putObject(
        key,
        lines.length ? `${lines.join('\n')}\n` : '',
        ndjsonContentType,
      );
      await deletePrefix(capturePartsPrefix(id, currentSessionId));

      const timestamp = new Date().toISOString();
      await recordingSessionEntity
        .patch({ sessionId: currentSessionId })
        .set({
          state: 'closed',
          startedAtEpochMs,
          stoppedAtEpochMs,
          eventsKey: key,
          parts: [],
          updatedAt: timestamp,
        })
        .go();

      res.json({
        state: 'closed',
        eventsKey: key,
        eventCount: lines.length,
        startedAtEpochMs,
        stoppedAtEpochMs,
      });
    },
  );

  return router;
};
