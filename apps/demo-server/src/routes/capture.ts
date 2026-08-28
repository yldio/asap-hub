import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import express, { Router } from 'express';
import { getTableName } from '../config';
import { captureBatchSchema } from '../schemas';
import { captureLifecycleTag, putObject } from '../storage';
import { getDocumentClient } from '../data/client';
import { recordingSessionEntity } from '../data/entities';
import { asyncRouter } from './async-router';
import {
  capturePartId,
  capturePartKey,
  captureQuota,
  captureTokenMatches,
  ndjsonContentType,
  recordingSessionKey,
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

// the snippet posts no-cors and never sees the response, so a retry of a batch
// that did land is normal traffic; reading the session and then appending would
// count its events twice and duplicate its part id, so every test the read made
// is repeated as the condition on the write itself
const appendPart = async (
  session: RecordingSessionItem,
  partId: string,
  events: number,
): Promise<void> => {
  const timestamp = new Date().toISOString();
  try {
    await getDocumentClient().send(
      new UpdateCommand({
        TableName: getTableName(),
        Key: recordingSessionKey(session.sessionId),
        UpdateExpression: [
          'SET lastEventAt = :timestamp, updatedAt = :timestamp,',
          '#parts = list_append(#parts, :part)',
          'ADD eventCount :events',
        ].join(' '),
        ConditionExpression: [
          '#state = :open',
          'expiresAt > :now',
          'NOT contains(#parts, :partId)',
          'size(#parts) < :maxParts',
          'eventCount <= :maxEventCount',
        ].join(' AND '),
        ExpressionAttributeNames: { '#parts': 'parts', '#state': 'state' },
        ExpressionAttributeValues: {
          ':timestamp': timestamp,
          ':part': [partId],
          ':partId': partId,
          ':events': events,
          ':open': 'open',
          ':now': Date.now(),
          ':maxParts': captureQuota.parts,
          ':maxEventCount': captureQuota.events - events,
        },
      }),
    );
  } catch (error) {
    if (!(error instanceof ConditionalCheckFailedException)) {
      throw error;
    }
  }
};

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
    // rewriting the same key with the same bytes is what a retry does, so the
    // object is put before the counters that must only ever move once
    await putObject(
      capturePartKey(session.videoId, session.sessionId, partId),
      `${lines.join('\n')}\n`,
      ndjsonContentType,
      captureLifecycleTag,
    );

    await appendPart(session, partId, batch.events.length);

    res.status(204).end();
  });

  return router;
};
