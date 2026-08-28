import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { Request, Response, Router } from 'express';
import { requireCreator } from '../auth';
import { getDemoHostname, getTableName } from '../config';
import { getDocumentClient } from '../data/client';
import { recordingSessionEntity } from '../data/entities';
import { finaliseRecordingSchema, maxCaptureBatchEvents } from '../schemas';
import {
  captureLifecycleTag,
  deletePrefix,
  getObjectText,
  projectPrefix,
  putObject,
} from '../storage';
import { mergeByTimestamp, partsByClient } from './capture-merge';
import { asyncRouter } from './async-router';
import { currentUser, pathParam, requireVideoIdParam } from './request';
import { validate } from './validate';
import { loadProject } from './video-shared';

export const recordingSessionKey = (sessionId: string) => ({
  PK: `RECORDING#${sessionId}`,
  SK: 'META',
});

export const captureSessionPrefix = (
  videoId: string,
  sessionId: string,
): string => `${projectPrefix(videoId)}capture/${sessionId}/`;

export const capturePartsPrefix = (
  videoId: string,
  sessionId: string,
): string => `${captureSessionPrefix(videoId, sessionId)}parts/`;

// a part belongs to one tab's numbering, so its id carries both
export const capturePartId = (clientId: string, seq: number): string =>
  `${clientId}:${seq}`;

export const capturePartKey = (
  videoId: string,
  sessionId: string,
  partId: string,
): string =>
  `${capturePartsPrefix(videoId, sessionId)}${partId.replace(':', '-')}.ndjson`;

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
  // "{clientId}:{seq}" per batch, so tabs sharing a session cannot collide
  parts: string[];
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

// closing first is what makes the merge safe: appendPart is conditioned on the
// session still being open, so once this write lands no further batch can be
// accepted, and a second finalise loses the same condition. The row comes back
// on the write, so a batch that landed between the read and the close is still
// merged rather than erased.
const closeSession = async (
  sessionId: string,
  startedAtEpochMs: number,
  stoppedAtEpochMs: number,
): Promise<Partial<RecordingSessionItem> | undefined> => {
  try {
    const { Attributes } = await getDocumentClient().send(
      new UpdateCommand({
        TableName: getTableName(),
        Key: recordingSessionKey(sessionId),
        UpdateExpression: [
          'SET #state = :closed, updatedAt = :timestamp,',
          'startedAtEpochMs = :startedAt, stoppedAtEpochMs = :stoppedAt',
        ].join(' '),
        ConditionExpression: '#state = :open',
        ExpressionAttributeNames: { '#state': 'state' },
        ExpressionAttributeValues: {
          ':closed': 'closed',
          ':open': 'open',
          ':startedAt': startedAtEpochMs,
          ':stoppedAt': stoppedAtEpochMs,
          ':timestamp': new Date().toISOString(),
        },
        ReturnValues: 'ALL_NEW',
      }),
    );
    return (Attributes as Partial<RecordingSessionItem> | undefined) ?? {};
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException) {
      return undefined;
    }
    throw error;
  }
};

const reportedState = (session: RecordingSessionItem): string =>
  session.state === 'open' && session.expiresAt <= Date.now()
    ? 'expired'
    : session.state;

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
        parts: [],
        expiresAt: now + sessionTtlMs,
        ttl: Math.floor((now + sessionTtlMs) / 1000),
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
        // several tabs share a session when the whole screen is recorded, and
        // the creator needs to see each one arrive
        clientCount: partsByClient(session.parts).size,
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

      const closed = await closeSession(
        currentSessionId,
        startedAtEpochMs,
        stoppedAtEpochMs,
      );
      if (!closed) {
        res.status(409).json({ error: 'already_finalised' });
        return;
      }

      // several tabs can share a session when the whole screen is recorded, so
      // each tab's parts are read in its own order and the streams are then
      // merged on the timestamps they all took from the same clock
      const byClient = partsByClient(closed.parts ?? session.parts);
      const streams = await Promise.all(
        [...byClient.values()].map((partIds) =>
          Promise.all(
            partIds.map((partId) =>
              // a batch that never landed must not sink the whole recording
              getObjectText(capturePartKey(id, currentSessionId, partId)).catch(
                () => '',
              ),
            ),
          ),
        ),
      );
      const lines = mergeByTimestamp(streams);

      const key = captureEventsKey(id, currentSessionId);
      await putObject(
        key,
        lines.length ? `${lines.join('\n')}\n` : '',
        ndjsonContentType,
        captureLifecycleTag,
      );
      await deletePrefix(capturePartsPrefix(id, currentSessionId));

      // the session is already closed; this only records where the merged
      // stream landed and drops the part ids it was built from
      await recordingSessionEntity
        .patch({ sessionId: currentSessionId })
        .set({
          eventsKey: key,
          parts: [],
          updatedAt: new Date().toISOString(),
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
