import express, { Router } from 'express';
import { captureBatchSchema } from '../schemas';
import { putObject } from '../storage';
import { recordingSessionEntity } from '../data/entities';
import { asyncRouter } from './async-router';
import {
  capturePartId,
  capturePartKey,
  captureQuota,
  captureTokenMatches,
  ndjsonContentType,
  RecordingSessionItem,
} from './recordings';

// the snippet posts a simple request so the host page never pays for a CORS
// preflight, which means the body arrives as text/plain and express.json,
// mounted globally, leaves it alone
export const maxCaptureBodyBytes = 1024 * 1024;

type CaptureBatch = {
  sessionId: string;
  token: string;
  clientId: string;
  seq: number;
  events: Record<string, unknown>[];
};

const fromJson = (body: string): unknown => {
  try {
    return JSON.parse(body);
  } catch {
    return undefined;
  }
};

// the snippet sends text; a caller that sends application/json has already been
// parsed by the global body parser, and either is read the same way
const parseBatch = (body: unknown): CaptureBatch | undefined => {
  const result = captureBatchSchema.safeParse(
    typeof body === 'string' ? fromJson(body) : body,
  );
  return result.success ? result.data : undefined;
};

const accepts = (
  session: RecordingSessionItem | undefined,
  batch: CaptureBatch,
): session is RecordingSessionItem =>
  session !== undefined &&
  session.state === 'open' &&
  session.expiresAt > Date.now() &&
  captureTokenMatches(batch.token, session.tokenHash) &&
  // each tab numbers its own batches, so the guard is per client: a replay is
  // rejected while a second tab recording the same screen is not
  !session.parts.includes(capturePartId(batch.clientId, batch.seq)) &&
  session.parts.length < captureQuota.parts &&
  session.eventCount + batch.events.length <= captureQuota.events;

export const captureRouter = (): Router => {
  const router = asyncRouter();

  router.use(express.text({ type: '*/*', limit: maxCaptureBodyBytes }));

  router.post('/', async (req, res) => {
    const batch = parseBatch(req.body);
    if (!batch) {
      res.status(400).end();
      return;
    }

    const { data } = await recordingSessionEntity
      .get({ sessionId: batch.sessionId })
      .go();
    const session = (data as RecordingSessionItem | null) ?? undefined;

    // every rejection from here answers exactly as an accepted batch does: an
    // unauthenticated caller must not be able to tell a wrong token from a
    // session that was never created
    if (!accepts(session, batch)) {
      res.status(204).end();
      return;
    }

    const partId = capturePartId(batch.clientId, batch.seq);
    const lines = batch.events.map((event) => JSON.stringify(event));
    await putObject(
      capturePartKey(session.videoId, session.sessionId, partId),
      `${lines.join('\n')}\n`,
      ndjsonContentType,
    );

    await recordingSessionEntity
      .patch({ sessionId: session.sessionId })
      .set({
        lastEventAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .add({ eventCount: batch.events.length })
      .append({ parts: [partId] })
      .go();

    res.status(204).end();
  });

  return router;
};
