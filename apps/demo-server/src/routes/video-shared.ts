import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { getTableName } from '../config';
import { getDocumentClient } from '../data/client';

export const leaseDurationMs = 90 * 1000;

export type VideoItem = Record<string, unknown>;

export const videoKey = (id: string) => ({ PK: `VIDEO#${id}`, SK: 'META' });

export const serialiseVideo = (item: VideoItem) => ({
  id: item.id,
  title: item.title,
  status: item.status,
  folderId: item.folderId,
  recordedAt: item.recordedAt,
  durationMs: item.durationMs ?? 0,
  chapters: item.chapters ?? [],
  processingState: item.processingState,
  ...(item.processingError ? { processingError: item.processingError } : {}),
  createdBy: item.createdBy,
  ...(item.lockedBy ? { lockedBy: item.lockedBy } : {}),
  ...(item.lockedByName ? { lockedByName: item.lockedByName } : {}),
  ...(typeof item.lockExpiresAt === 'number'
    ? { lockExpiresAt: new Date(item.lockExpiresAt).toISOString() }
    : {}),
  version: item.version,
  kind: item.kind ?? 'upload',
  ...(item.mediaPath ? { mediaPath: item.mediaPath } : {}),
  ...(item.timeline ? { timeline: item.timeline } : {}),
  ...(item.render ? { render: item.render } : {}),
});

export const failedItem = (error: unknown): VideoItem | undefined =>
  error instanceof ConditionalCheckFailedException
    ? (error.Item as VideoItem | undefined)
    : undefined;

// an unexpired lease held by the caller; the same test is repeated as a
// condition on every write so a takeover between the read and the write loses
export const holdsLease = (
  item: VideoItem,
  sub: string,
  now: number,
): boolean =>
  item.lockedBy === sub &&
  typeof item.lockExpiresAt === 'number' &&
  item.lockExpiresAt > now;

export const leaseCondition = 'lockedBy = :sub AND lockExpiresAt > :now';

// ReturnValuesOnConditionCheckFailure hands back raw AttributeValues, while a
// stubbed client in tests may hand back plain values
const unwrap = (raw: unknown): unknown => {
  if (raw && typeof raw === 'object') {
    if ('S' in raw) return String((raw as { S: unknown }).S);
    if ('N' in raw) return Number((raw as { N: unknown }).N);
  }
  return raw;
};

export const holderNameOf = (item?: VideoItem): string | undefined => {
  const name = unwrap(item?.lockedByName);
  return typeof name === 'string' ? name : undefined;
};

// the write condition bundles the lease and the version, so the item returned
// on failure is what tells the client whether to warn about a takeover or rebase
export const conflictBody = (
  item: VideoItem,
  sub: string,
  now: number,
): Record<string, unknown> => {
  const lost = !holdsLease(
    {
      lockedBy: unwrap(item.lockedBy),
      lockExpiresAt: unwrap(item.lockExpiresAt),
    },
    sub,
    now,
  );
  const holderName = holderNameOf(item);
  return {
    error: lost ? 'locked' : 'conflict',
    ...(holderName ? { holderName } : {}),
  };
};

export class VideoWriteConflict extends Error {
  constructor(readonly body: Record<string, unknown>) {
    super(String(body.error));
    this.name = 'VideoWriteConflict';
  }
}

type GuardedUpdate = {
  id: string;
  sub: string;
  now: number;
  expectedVersion: number;
  set: Record<string, unknown>;
  remove?: string[];
};

const namePlaceholder = (attribute: string) => `#${attribute}`;
const valuePlaceholder = (attribute: string) => `:${attribute}`;

// every studio write is conditioned on the caller still holding the lease and on
// the version it read, so one helper owns the expression all of them share
export const guardedUpdate = async ({
  id,
  sub,
  now,
  expectedVersion,
  set,
  remove = [],
}: GuardedUpdate): Promise<void> => {
  const attributes = Object.keys(set);
  const assignments = [
    ...attributes.map(
      (attribute) =>
        `${namePlaceholder(attribute)} = ${valuePlaceholder(attribute)}`,
    ),
    '#version = #version + :one',
  ];

  try {
    await getDocumentClient().send(
      new UpdateCommand({
        TableName: getTableName(),
        Key: videoKey(id),
        UpdateExpression: [
          `SET ${assignments.join(', ')}`,
          ...(remove.length ? [`REMOVE ${remove.join(', ')}`] : []),
        ].join(' '),
        ConditionExpression: `${leaseCondition} AND #version = :expectedVersion`,
        ExpressionAttributeNames: {
          ...Object.fromEntries(
            attributes.map((attribute) => [
              namePlaceholder(attribute),
              attribute,
            ]),
          ),
          '#version': 'version',
        },
        ExpressionAttributeValues: {
          ...Object.fromEntries(
            attributes.map((attribute) => [
              valuePlaceholder(attribute),
              set[attribute],
            ]),
          ),
          ':one': 1,
          ':sub': sub,
          ':now': now,
          ':expectedVersion': expectedVersion,
        },
        ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
      }),
    );
  } catch (error) {
    const item = failedItem(error);
    if (item) {
      throw new VideoWriteConflict(conflictBody(item, sub, now));
    }
    throw error;
  }
};
