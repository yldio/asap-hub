process.env.SLS_STAGE = 'local';
process.env.TABLE_NAME = 'demo-hub-test-data';
process.env.BUCKET_NAME = 'demo-hub-test-storage';

/* eslint-disable import/first */
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { createHash } from 'crypto';
import supertest from 'supertest';
import { appFactory } from '../src/app';
import {
  recordingSessionEntity,
  userEntity,
  videoEntity,
} from '../src/data/entities';
import * as storage from '../src/storage';
/* eslint-enable import/first */

jest.mock('../src/storage', () => ({
  ...jest.requireActual('../src/storage'),
  putObject: jest.fn(),
  getObjectText: jest.fn(),
  deletePrefix: jest.fn(),
}));

const mockSend = jest.fn();
jest.mock('../src/data/client', () => ({
  getDocumentClient: () => ({
    send: (...args: unknown[]) => mockSend(...args),
  }),
  setDocumentClient: jest.fn(),
}));

const bearer = (claims: Record<string, unknown>): string => {
  const encode = (value: unknown) =>
    Buffer.from(JSON.stringify(value)).toString('base64url');
  return `Bearer ${encode({ alg: 'none' })}.${encode(claims)}.signature`;
};

const creatorToken = bearer({
  sub: 'auth0|creator',
  email: 'ana@example.com',
  email_verified: true,
  name: 'Ana',
});

const memberToken = bearer({
  sub: 'auth0|member',
  email: 'bob@example.com',
  email_verified: true,
  name: 'Bob',
});

const api = supertest(appFactory());

const mockUser = (role: 'creator' | 'member' | 'admin', sub: string) => {
  jest.spyOn(userEntity, 'get').mockReturnValue({
    go: async () => ({
      data: {
        sub,
        name: 'Ana',
        email: 'ana@example.com',
        role,
        status: 'active',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
};

const projectItem = (overrides: Record<string, unknown> = {}) => ({
  id: 'project-1',
  title: 'Sprint 12 demo',
  status: 'draft',
  folderId: 'ROOT',
  recordedAt: '2026-08-01T10:00:00.000Z',
  kind: 'studio',
  processingState: 'empty',
  version: 3,
  createdBy: { sub: 'auth0|creator', name: 'Ana' },
  createdAt: '2026-08-01T10:00:00.000Z',
  updatedAt: '2026-08-01T10:00:00.000Z',
  ...overrides,
});

const token = 'a-capture-token';

const sessionItem = (overrides: Record<string, unknown> = {}) => ({
  sessionId: 'session-1',
  videoId: 'project-1',
  tokenHash: createHash('sha256').update(token).digest('hex'),
  state: 'open',
  eventCount: 4,
  parts: ['tab-a:1', 'tab-a:2'],
  lastEventAt: '2026-08-01T10:05:00.000Z',
  expiresAt: Date.now() + 60_000,
  createdBy: { sub: 'auth0|creator', name: 'Ana' },
  createdAt: '2026-08-01T10:00:00.000Z',
  updatedAt: '2026-08-01T10:05:00.000Z',
  ...overrides,
});

const mockVideoGet = (data: Record<string, unknown> | null) => {
  jest.spyOn(videoEntity, 'get').mockReturnValue({
    go: async () => ({ data }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
};

const mockSessionGet = (data: Record<string, unknown> | null) => {
  jest.spyOn(recordingSessionEntity, 'get').mockReturnValue({
    go: async () => ({ data }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
};

const mockSessionCreate = () =>
  jest
    .spyOn(recordingSessionEntity, 'create')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .mockReturnValue({ go: async () => ({ data: {} }) } as any);

// patch chains .set().add().append().go(); each link is recorded so a test can
// assert on the counters the capture endpoint bumped
const mockSessionPatch = () => {
  const calls = {
    set: jest.fn(),
    add: jest.fn(),
    append: jest.fn(),
  };
  const chain: Record<string, unknown> = { go: async () => ({ data: {} }) };
  (['set', 'add', 'append'] as const).forEach((method) => {
    chain[method] = (value: unknown) => {
      calls[method](value);
      return chain;
    };
  });
  jest
    .spyOn(recordingSessionEntity, 'patch')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .mockReturnValue(chain as any);
  return calls;
};

const postCapture = (body: Record<string, unknown>) =>
  api
    .post('/api/capture')
    .set('Content-Type', 'text/plain;charset=UTF-8')
    .send(JSON.stringify(body));

const batch = (overrides: Record<string, unknown> = {}) => ({
  sessionId: 'session-1',
  token,
  clientId: 'tab-a',
  seq: 3,
  events: [
    { id: 'e1', type: 'move', t: 1, x: 2, y: 3 },
    { id: 'e2', type: 'click', t: 4, x: 5, y: 6 },
  ],
  ...overrides,
});

// the reusable bookmark: the token lives on the project row and the row says
// which session is open, so one bookmark saved once serves every take
const projectToken = 'a-project-token';

const bookmarkedProject = (overrides: Record<string, unknown> = {}) =>
  projectItem({
    captureTokenHash: createHash('sha256').update(projectToken).digest('hex'),
    captureSessionId: 'session-1',
    ...overrides,
  });

const projectBatch = (overrides: Record<string, unknown> = {}) => {
  const { sessionId, ...rest } = batch();
  return { ...rest, projectId: 'project-1', token: projectToken, ...overrides };
};

// the capture endpoint writes through the document client so the idempotency
// guard can ride on the update's own ConditionExpression
const captureWrites = () =>
  mockSend.mock.calls.map(([command]) => command.input);

// a row write echoes what it set, which is how the route tells the token it
// minted from one the project already had
const echoVideoWrite = () =>
  mockSend.mockImplementation(
    async (command: {
      input: { ExpressionAttributeValues?: Record<string, string> };
    }) => ({
      Attributes: {
        captureTokenHash:
          command.input.ExpressionAttributeValues?.[':tokenHash'],
      },
    }),
  );

const hashOf = (token: string) =>
  createHash('sha256').update(token).digest('hex');

const bookmarkTokenOf = (snippetUrl: string) =>
  snippetUrl.split('#project.project-1.')[1] ?? '';

beforeEach(() => {
  jest.restoreAllMocks();
  mockSend.mockReset().mockResolvedValue({});
  (storage.putObject as jest.Mock).mockReset().mockResolvedValue(undefined);
  (storage.getObjectText as jest.Mock).mockReset();
  (storage.deletePrefix as jest.Mock).mockReset().mockResolvedValue(undefined);
});

describe('POST /api/projects/:id/recordings', () => {
  it('hands a bookmark for the project back once and stores only its hash', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem());
    const create = mockSessionCreate();
    echoVideoWrite();

    const response = await api
      .post('/api/projects/project-1/recordings')
      .set('Authorization', creatorToken);

    expect(response.status).toBe(201);
    const { sessionId, token: issued, snippetUrl, captureUrl } = response.body;
    expect(sessionId).toMatch(/^[0-9a-f]{32}$/);
    // the bookmark names the project, not the take, so it is saved once and
    // reused by every recording after this one
    expect(snippetUrl).toBe(
      `http://localhost:3500/capture/v1.js#project.project-1.${bookmarkTokenOf(
        snippetUrl,
      )}`,
    );
    expect(response.body.bookmarkReady).toBe(false);
    expect(captureUrl).toBe('http://localhost:3500/api/capture');

    const [write] = captureWrites();
    expect(write.Key).toEqual({ PK: 'VIDEO#project-1', SK: 'META' });
    expect(write.UpdateExpression).toContain(
      'captureTokenHash = if_not_exists(captureTokenHash, :tokenHash)',
    );
    expect(write.ExpressionAttributeValues[':sessionId']).toBe(sessionId);
    expect(write.ExpressionAttributeValues[':tokenHash']).toBe(
      hashOf(bookmarkTokenOf(snippetUrl)),
    );
    expect(JSON.stringify(write)).not.toContain(bookmarkTokenOf(snippetUrl));

    const stored = create.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(stored).toMatchObject({
      sessionId,
      videoId: 'project-1',
      state: 'open',
      eventCount: 0,
      parts: [],
      tokenHash: createHash('sha256').update(issued).digest('hex'),
    });
    expect(JSON.stringify(stored)).not.toContain(issued);
  });

  // the whole point of the reusable bookmark: a second recording must not
  // silently replace the token the creator already saved in their browser
  it('leaves the bookmark a project already has alone', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(bookmarkedProject());
    mockSessionCreate();
    mockSend.mockResolvedValue({
      Attributes: { captureTokenHash: hashOf(projectToken) },
    });

    const response = await api
      .post('/api/projects/project-1/recordings')
      .set('Authorization', creatorToken);

    expect(response.status).toBe(201);
    expect(response.body.snippetUrl).toBeUndefined();
    expect(response.body.bookmarkReady).toBe(true);
  });

  it('points the project at the session it just opened', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(bookmarkedProject());
    mockSessionCreate();
    echoVideoWrite();

    const response = await api
      .post('/api/projects/project-1/recordings')
      .set('Authorization', creatorToken);

    const [write] = captureWrites();
    expect(write.UpdateExpression).toContain('captureSessionId = :sessionId');
    expect(write.ExpressionAttributeValues[':sessionId']).toBe(
      response.body.sessionId,
    );
  });

  // DynamoDB reads a TTL attribute as epoch seconds, so the row carries the
  // same instant twice: expiresAt in the milliseconds the routes compare, and
  // ttl in the seconds the table's TimeToLiveSpecification points at
  it('gives the session a ttl in the seconds dynamodb expires on', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem());
    const create = mockSessionCreate();

    await api
      .post('/api/projects/project-1/recordings')
      .set('Authorization', creatorToken);

    const stored = create.mock.calls[0]?.[0] as {
      expiresAt: number;
      ttl: number;
    };
    expect(stored.ttl).toBe(Math.floor(stored.expiresAt / 1000));
  });

  it('is not found for a plain upload', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem({ kind: 'upload' }));

    const response = await api
      .post('/api/projects/project-1/recordings')
      .set('Authorization', creatorToken);

    expect(response.status).toBe(404);
  });

  it('refuses a member', async () => {
    mockUser('member', 'auth0|member');

    const response = await api
      .post('/api/projects/project-1/recordings')
      .set('Authorization', memberToken);

    expect(response.status).toBe(403);
  });
});

describe('POST /api/projects/:id/capture-bookmark', () => {
  it('mints a new bookmark and overwrites the hash the old one is checked against', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(bookmarkedProject());

    const response = await api
      .post('/api/projects/project-1/capture-bookmark')
      .set('Authorization', creatorToken);

    expect(response.status).toBe(201);
    const rotated = bookmarkTokenOf(response.body.snippetUrl);
    expect(rotated).not.toBe(projectToken);
    expect(response.body.snippetUrl).toBe(
      `http://localhost:3500/capture/v1.js#project.project-1.${rotated}`,
    );

    const [write] = captureWrites();
    expect(write.Key).toEqual({ PK: 'VIDEO#project-1', SK: 'META' });
    expect(write.UpdateExpression).toBe('SET captureTokenHash = :tokenHash');
    expect(write.ExpressionAttributeValues[':tokenHash']).toBe(hashOf(rotated));
    expect(JSON.stringify(write)).not.toContain(rotated);
  });

  // rotating is the whole revocation story: the row holds one hash, so a
  // bookmark carrying the token it replaced stops being accepted
  it('leaves a bookmark carrying the replaced token unaccepted', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(bookmarkedProject());

    const rotation = await api
      .post('/api/projects/project-1/capture-bookmark')
      .set('Authorization', creatorToken);
    const rotated = bookmarkTokenOf(rotation.body.snippetUrl);

    jest.restoreAllMocks();
    mockSend.mockReset().mockResolvedValue({});
    mockVideoGet(bookmarkedProject({ captureTokenHash: hashOf(rotated) }));
    mockSessionGet(sessionItem());

    const refused = await postCapture(projectBatch());
    expect(refused.status).toBe(204);
    expect(storage.putObject).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();

    const accepted = await postCapture(projectBatch({ token: rotated }));
    expect(accepted.status).toBe(204);
    expect(storage.putObject).toHaveBeenCalledTimes(1);
  });

  it('is not found for a plain upload', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem({ kind: 'upload' }));

    const response = await api
      .post('/api/projects/project-1/capture-bookmark')
      .set('Authorization', creatorToken);

    expect(response.status).toBe(404);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('refuses a member', async () => {
    mockUser('member', 'auth0|member');

    const response = await api
      .post('/api/projects/project-1/capture-bookmark')
      .set('Authorization', memberToken);

    expect(response.status).toBe(403);
  });
});

describe('GET /api/projects/:id/recordings/:sessionId', () => {
  it('reports what the studio indicator shows', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem());
    mockSessionGet(sessionItem());

    const response = await api
      .get('/api/projects/project-1/recordings/session-1')
      .set('Authorization', creatorToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      state: 'open',
      eventCount: 4,
      // one tab so far; a second one recording the same screen would say two
      clientCount: 1,
      lastEventAt: '2026-08-01T10:05:00.000Z',
    });
  });

  it('reports an open session past its lifetime as expired', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem());
    mockSessionGet(sessionItem({ expiresAt: Date.now() - 1 }));

    const response = await api
      .get('/api/projects/project-1/recordings/session-1')
      .set('Authorization', creatorToken);

    expect(response.body.state).toBe('expired');
  });

  it('is not found for a session belonging to another project', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem());
    mockSessionGet(sessionItem({ videoId: 'project-2' }));

    const response = await api
      .get('/api/projects/project-1/recordings/session-1')
      .set('Authorization', creatorToken);

    expect(response.status).toBe(404);
  });
});

describe('POST /api/capture', () => {
  it('needs no authentication and writes the batch under the session', async () => {
    mockSessionGet(sessionItem());

    const response = await postCapture(batch());

    expect(response.status).toBe(204);
    expect(response.text).toBe('');
    expect(storage.putObject).toHaveBeenCalledWith(
      'projects/project-1/capture/session-1/parts/tab-a-3.ndjson',
      '{"id":"e1","type":"move","t":1,"x":2,"y":3}\n{"id":"e2","type":"click","t":4,"x":5,"y":6}\n',
      'application/x-ndjson',
      'lifecycle=capture',
    );

    const [write] = captureWrites();
    expect(write.Key).toEqual({ PK: 'RECORDING#session-1', SK: 'META' });
    expect(write.ExpressionAttributeValues).toMatchObject({
      ':part': ['tab-a:3'],
      ':partId': 'tab-a:3',
      ':events': 2,
    });
  });

  // the snippet posts no-cors and never sees the response, so a retry of a batch
  // that did land is ordinary traffic and must not be counted twice
  it('makes the part id and the quotas conditions of the write itself', async () => {
    mockSessionGet(sessionItem());

    await postCapture(batch());

    const [{ ConditionExpression, ExpressionAttributeValues }] =
      captureWrites();
    expect(ConditionExpression).toContain('NOT contains(#parts, :partId)');
    expect(ConditionExpression).toContain('size(#parts) < :maxParts');
    expect(ConditionExpression).toContain('eventCount <= :maxEventCount');
    expect(ConditionExpression).toContain('#state = :open');
    expect(ConditionExpression).toContain('expiresAt > :now');
    expect(ExpressionAttributeValues[':maxParts']).toBe(500);
    expect(ExpressionAttributeValues[':maxEventCount']).toBe(200_000 - 2);
  });

  it('still answers 204 when the write loses its condition to a retry', async () => {
    mockSessionGet(sessionItem());
    mockSend.mockRejectedValue(
      new ConditionalCheckFailedException({
        message: 'The conditional request failed',
        $metadata: {},
      }),
    );

    const response = await postCapture(batch());

    expect(response.status).toBe(204);
    expect(response.text).toBe('');
  });

  // the session read is stale for every concurrent batch, so the conditional
  // counter write is the only thing that bounds the object writes; putting the
  // object first let N batches with distinct seq each write up to a MiB while
  // only the quota's worth of counters landed
  it('writes nothing to s3 when the counter write loses its condition', async () => {
    mockSessionGet(sessionItem());
    mockSend.mockRejectedValue(
      new ConditionalCheckFailedException({
        message: 'The conditional request failed',
        $metadata: {},
      }),
    );

    await postCapture(batch());

    expect(storage.putObject).not.toHaveBeenCalled();
  });

  it('claims the counter slot before it writes the object', async () => {
    mockSessionGet(sessionItem());
    const order: string[] = [];
    mockSend.mockImplementation(async () => {
      order.push('counter');
      return {};
    });
    (storage.putObject as jest.Mock).mockImplementation(async () => {
      order.push('object');
    });

    await postCapture(batch());

    expect(order).toEqual(['counter', 'object']);
  });

  it('never writes anything under raw/', async () => {
    mockSessionGet(sessionItem());

    await postCapture(batch());

    const [key] = (storage.putObject as jest.Mock).mock.calls[0] as string[];
    expect(key).toMatch(/^projects\//);
  });

  it.each([
    ['an unknown session', null, batch()],
    ['a wrong token', sessionItem(), batch({ token: 'not-the-token' })],
    ['an expired session', sessionItem({ expiresAt: Date.now() - 1 }), batch()],
    ['a closed session', sessionItem({ state: 'closed' }), batch()],
    ['a replayed batch from the same tab', sessionItem(), batch({ seq: 2 })],
    [
      'a session over its event quota',
      sessionItem({ eventCount: 199_999 }),
      batch(),
    ],
    [
      'a session over its batch quota',
      sessionItem({ parts: new Array(500).fill('tab-a:1') }),
      batch(),
    ],
  ])('answers 204 and stores nothing for %s', async (_label, session, body) => {
    mockSessionGet(session);

    const response = await postCapture(body);

    expect(response.status).toBe(204);
    expect(storage.putObject).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it.each([
    ['a body that is not json', 'not json at all'],
    ['a batch with no events', JSON.stringify(batch({ events: [] }))],
    [
      'a session id outside the safe alphabet',
      JSON.stringify(batch({ sessionId: '../../etc' })),
    ],
    [
      'a sequence number that is not positive',
      JSON.stringify(batch({ seq: 0 })),
    ],
  ])(
    'answers 400 for %s without touching the session',
    async (_label, body) => {
      const get = jest.spyOn(recordingSessionEntity, 'get');

      const response = await api
        .post('/api/capture')
        .set('Content-Type', 'text/plain;charset=UTF-8')
        .send(body);

      expect(response.status).toBe(400);
      expect(get).not.toHaveBeenCalled();
      expect(storage.putObject).not.toHaveBeenCalled();
    },
  );

  it('rejects a batch larger than the cap', async () => {
    mockSessionGet(sessionItem());

    const response = await postCapture(
      batch({
        events: new Array(5001).fill({ id: 'e', type: 'move', t: 1 }),
      }),
    );

    expect(response.status).toBe(400);
    expect(storage.putObject).not.toHaveBeenCalled();
  });
});

describe('POST /api/capture from the reusable bookmark', () => {
  // the bug this replaces: every recording minted a session, so a bookmark
  // saved from an earlier one posted to a session that was already closed
  it('routes a batch that names the project to the session it has open', async () => {
    mockVideoGet(bookmarkedProject());
    mockSessionGet(sessionItem());

    const response = await postCapture(projectBatch());

    expect(response.status).toBe(204);
    expect(storage.putObject).toHaveBeenCalledWith(
      'projects/project-1/capture/session-1/parts/tab-a-3.ndjson',
      expect.any(String),
      'application/x-ndjson',
      'lifecycle=capture',
    );
    const [write] = captureWrites();
    expect(write.Key).toEqual({ PK: 'RECORDING#session-1', SK: 'META' });
  });

  it('follows the project to a session opened after the bookmark was saved', async () => {
    mockVideoGet(bookmarkedProject({ captureSessionId: 'session-9' }));
    mockSessionGet(sessionItem({ sessionId: 'session-9', parts: [] }));

    const response = await postCapture(projectBatch());

    expect(response.status).toBe(204);
    const [write] = captureWrites();
    expect(write.Key).toEqual({ PK: 'RECORDING#session-9', SK: 'META' });
  });

  // a bookmark saved before the reusable one carries its session's own token
  // and must keep working for as long as that session is open
  it('still accepts a bookmark that names the session', async () => {
    mockSessionGet(sessionItem());

    const response = await postCapture(batch());

    expect(response.status).toBe(204);
    expect(storage.putObject).toHaveBeenCalledWith(
      'projects/project-1/capture/session-1/parts/tab-a-3.ndjson',
      expect.any(String),
      'application/x-ndjson',
      'lifecycle=capture',
    );
  });

  it.each([
    [
      'nothing is recording',
      bookmarkedProject({ captureSessionId: undefined }),
    ],
    [
      'the project has no bookmark',
      projectItem({ captureSessionId: 'session-1' }),
    ],
    ['the project is gone', null],
  ])('answers 204 and stores nothing when %s', async (_label, project) => {
    mockVideoGet(project);
    mockSessionGet(sessionItem());

    const response = await postCapture(projectBatch());

    expect(response.status).toBe(204);
    expect(storage.putObject).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it.each([
    ['the take has been finalised', sessionItem({ state: 'closed' })],
    ['the session has expired', sessionItem({ expiresAt: Date.now() - 1 })],
    [
      'the session belongs to another project',
      sessionItem({ videoId: 'project-2' }),
    ],
    ['the batch is a replay', sessionItem()],
  ])('answers 204 and stores nothing when %s', async (label, session) => {
    mockVideoGet(bookmarkedProject());
    mockSessionGet(session);

    const response = await postCapture(
      projectBatch(label === 'the batch is a replay' ? { seq: 2 } : {}),
    );

    expect(response.status).toBe(204);
    expect(storage.putObject).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('answers 204 for a token the project no longer holds', async () => {
    mockVideoGet(bookmarkedProject());
    mockSessionGet(sessionItem());

    const response = await postCapture(
      projectBatch({ token: 'not-the-token' }),
    );

    expect(response.status).toBe(204);
    expect(storage.putObject).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  // the quota bounds the S3 writes, not only the counters, so it has to hold on
  // the routed session exactly as it does on a named one
  it('holds the event quota and keeps it a condition of the write', async () => {
    mockVideoGet(bookmarkedProject());
    mockSessionGet(sessionItem({ eventCount: 199_999 }));

    const over = await postCapture(projectBatch());

    expect(over.status).toBe(204);
    expect(storage.putObject).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();

    mockSessionGet(sessionItem());
    await postCapture(projectBatch());

    const [{ ConditionExpression, ExpressionAttributeValues }] =
      captureWrites();
    expect(ConditionExpression).toContain('eventCount <= :maxEventCount');
    expect(ConditionExpression).toContain('size(#parts) < :maxParts');
    expect(ExpressionAttributeValues[':maxEventCount']).toBe(200_000 - 2);
  });

  it('holds the batch quota on the routed session', async () => {
    mockVideoGet(bookmarkedProject());
    mockSessionGet(sessionItem({ parts: new Array(500).fill('tab-a:1') }));

    const response = await postCapture(projectBatch());

    expect(response.status).toBe(204);
    expect(storage.putObject).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('writes nothing to s3 when the counter write loses its condition', async () => {
    mockVideoGet(bookmarkedProject());
    mockSessionGet(sessionItem());
    mockSend.mockRejectedValue(
      new ConditionalCheckFailedException({
        message: 'The conditional request failed',
        $metadata: {},
      }),
    );

    const response = await postCapture(projectBatch());

    expect(response.status).toBe(204);
    expect(storage.putObject).not.toHaveBeenCalled();
  });

  it.each([
    [
      'names both a project and a session',
      { ...projectBatch(), sessionId: 'session-1' },
    ],
    ['names neither', { ...projectBatch(), projectId: undefined }],
    [
      'names a project outside the safe alphabet',
      projectBatch({ projectId: '../../etc' }),
    ],
  ])('answers 400 for a batch that %s', async (_label, body) => {
    const videos = jest.spyOn(videoEntity, 'get');
    const sessions = jest.spyOn(recordingSessionEntity, 'get');

    const response = await postCapture(body);

    expect(response.status).toBe(400);
    expect(videos).not.toHaveBeenCalled();
    expect(sessions).not.toHaveBeenCalled();
    expect(storage.putObject).not.toHaveBeenCalled();
  });
});

describe('POST /api/projects/:id/recordings/:sessionId/finalise', () => {
  const finalise = (body: Record<string, unknown>) =>
    api
      .post('/api/projects/project-1/recordings/session-1/finalise')
      .set('Authorization', creatorToken)
      .send(body);

  it('concatenates the batches into one immutable stream and closes the session', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem());
    mockSessionGet(sessionItem({ parts: ['tab-a:2', 'tab-a:1', 'tab-a:2'] }));
    const patch = mockSessionPatch();
    (storage.getObjectText as jest.Mock).mockImplementation(
      async (key: string) =>
        key.endsWith('tab-a-1.ndjson')
          ? '{"id":"e1","t":1}\n'
          : '{"id":"e2","t":2}\n{"id":"e3","t":3}',
    );

    const response = await finalise({
      startedAtEpochMs: 1_700_000_000_000,
      stoppedAtEpochMs: 1_700_000_060_000,
    });

    expect(response.status).toBe(200);
    expect(storage.getObjectText).toHaveBeenCalledTimes(2);
    expect(storage.putObject).toHaveBeenCalledWith(
      'projects/project-1/capture/session-1/events.ndjson',
      '{"id":"e1","t":1}\n{"id":"e2","t":2}\n{"id":"e3","t":3}\n',
      'application/x-ndjson',
      'lifecycle=capture',
    );
    expect(storage.deletePrefix).toHaveBeenCalledWith(
      'projects/project-1/capture/session-1/parts/',
    );
    expect(patch.set).toHaveBeenCalledWith(
      expect.objectContaining({
        eventsKey: 'projects/project-1/capture/session-1/events.ndjson',
        parts: [],
      }),
    );
    expect(response.body).toEqual({
      state: 'closed',
      eventsKey: 'projects/project-1/capture/session-1/events.ndjson',
      eventCount: 3,
      startedAtEpochMs: 1_700_000_000_000,
      stoppedAtEpochMs: 1_700_000_060_000,
    });
  });

  it('carries on when a batch object never landed', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem());
    mockSessionGet(sessionItem({ parts: ['tab-a:1', 'tab-a:2'] }));
    mockSessionPatch();
    (storage.getObjectText as jest.Mock).mockImplementation(
      async (key: string) => {
        if (key.endsWith('1.ndjson')) {
          throw new Error('NoSuchKey');
        }
        return '{"id":"e2"}\n';
      },
    );

    const response = await finalise({
      startedAtEpochMs: 1_700_000_000_000,
      stoppedAtEpochMs: 1_700_000_060_000,
    });

    expect(response.status).toBe(200);
    expect(response.body.eventCount).toBe(1);
  });

  it('refuses to finalise a session twice', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem());
    mockSessionGet(sessionItem({ state: 'closed' }));

    const response = await finalise({
      startedAtEpochMs: 1_700_000_000_000,
      stoppedAtEpochMs: 1_700_000_060_000,
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'already_finalised' });
    expect(storage.putObject).not.toHaveBeenCalled();
  });

  it('rejects a window that stops before it started', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem());
    mockSessionGet(sessionItem());

    const response = await finalise({
      startedAtEpochMs: 1_700_000_060_000,
      stoppedAtEpochMs: 1_700_000_000_000,
    });

    expect(response.status).toBe(400);
    expect(storage.putObject).not.toHaveBeenCalled();
  });

  // a batch accepted after the merge was written, but before the row said
  // closed, used to be erased with the parts list and never reach the stream
  it('closes the session with a conditional write before it merges anything', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem());
    mockSessionGet(sessionItem({ parts: ['tab-a:1'] }));
    mockSessionPatch();
    (storage.getObjectText as jest.Mock).mockResolvedValue('{"id":"e1"}\n');
    const order: string[] = [];
    mockSend.mockImplementation(async () => {
      order.push('close');
      return {};
    });
    (storage.putObject as jest.Mock).mockImplementation(async () => {
      order.push('merge');
    });

    const response = await finalise({
      startedAtEpochMs: 1_700_000_000_000,
      stoppedAtEpochMs: 1_700_000_060_000,
    });

    expect(response.status).toBe(200);
    expect(order).toEqual(['close', 'merge']);

    const { ConditionExpression, ExpressionAttributeValues, ReturnValues } =
      mockSend.mock.calls[0]![0].input;
    expect(ConditionExpression).toBe('#state = :open');
    expect(ExpressionAttributeValues[':closed']).toBe('closed');
    expect(ExpressionAttributeValues[':startedAt']).toBe(1_700_000_000_000);
    expect(ReturnValues).toBe('ALL_NEW');
  });

  // both requests pass the read's state check, so only the condition separates them
  it('refuses the second of two concurrent finalises', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem());
    mockSessionGet(sessionItem());
    mockSessionPatch();
    mockSend.mockRejectedValue(
      new ConditionalCheckFailedException({
        message: 'The conditional request failed',
        $metadata: {},
      }),
    );

    const response = await finalise({
      startedAtEpochMs: 1_700_000_000_000,
      stoppedAtEpochMs: 1_700_000_060_000,
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'already_finalised' });
    expect(storage.putObject).not.toHaveBeenCalled();
    expect(storage.deletePrefix).not.toHaveBeenCalled();
  });

  it('merges the parts the close returned, not the ones the read saw', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem());
    mockSessionGet(sessionItem({ parts: ['tab-a:1'] }));
    mockSessionPatch();
    // a batch landed between the read and the close, so the row carries two
    mockSend.mockResolvedValue({
      Attributes: { parts: ['tab-a:1', 'tab-a:2'] },
    });
    (storage.getObjectText as jest.Mock).mockImplementation(
      async (key: string) =>
        key.endsWith('tab-a-1.ndjson')
          ? '{"id":"e1","t":1}'
          : '{"id":"e2","t":2}',
    );

    const response = await finalise({
      startedAtEpochMs: 1_700_000_000_000,
      stoppedAtEpochMs: 1_700_000_060_000,
    });

    expect(response.body.eventCount).toBe(2);
    expect(storage.putObject).toHaveBeenCalledWith(
      'projects/project-1/capture/session-1/events.ndjson',
      '{"id":"e1","t":1}\n{"id":"e2","t":2}\n',
      'application/x-ndjson',
      'lifecycle=capture',
    );
  });
});

describe('two tabs sharing one session', () => {
  it('accepts a batch from each, because the sequence guard is per tab', async () => {
    mockSessionGet(sessionItem({ parts: [] }));

    const first = await postCapture(batch({ clientId: 'tab-a', seq: 1 }));
    const second = await postCapture(batch({ clientId: 'tab-b', seq: 1 }));

    expect(first.status).toBe(204);
    expect(second.status).toBe(204);
    expect(
      captureWrites().map(
        ({ ExpressionAttributeValues }) => ExpressionAttributeValues[':part'],
      ),
    ).toEqual([['tab-a:1'], ['tab-b:1']]);
  });

  it('writes each tab its own part object', async () => {
    mockSessionGet(sessionItem({ parts: [] }));

    await postCapture(batch({ clientId: 'tab-b', seq: 4 }));

    expect(storage.putObject).toHaveBeenCalledWith(
      'projects/project-1/capture/session-1/parts/tab-b-4.ndjson',
      expect.any(String),
      'application/x-ndjson',
      'lifecycle=capture',
    );
  });

  const finalise = (body: Record<string, unknown>) =>
    api
      .post('/api/projects/project-1/recordings/session-1/finalise')
      .set('Authorization', creatorToken)
      .send(body);

  it('merges both streams into one, ordered by the clock they share', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem());
    mockSessionGet(sessionItem({ parts: ['tab-a:1', 'tab-b:1', 'tab-a:2'] }));
    mockSessionPatch();
    (storage.getObjectText as jest.Mock).mockImplementation(
      async (key: string) => {
        if (key.endsWith('tab-a-1.ndjson')) return '{"id":"a1","t":10}';
        if (key.endsWith('tab-a-2.ndjson')) return '{"id":"a2","t":30}';
        return '{"id":"b1","t":20}';
      },
    );

    const response = await finalise({
      startedAtEpochMs: 1_700_000_000_000,
      stoppedAtEpochMs: 1_700_000_060_000,
    });

    expect(response.status).toBe(200);
    expect(storage.putObject).toHaveBeenCalledWith(
      'projects/project-1/capture/session-1/events.ndjson',
      '{"id":"a1","t":10}\n{"id":"b1","t":20}\n{"id":"a2","t":30}\n',
      'application/x-ndjson',
      'lifecycle=capture',
    );
  });
});
