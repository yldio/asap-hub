process.env.SLS_STAGE = 'local';
process.env.TABLE_NAME = 'demo-hub-test-data';
process.env.BUCKET_NAME = 'demo-hub-test-storage';

/* eslint-disable import/first */
import { createEmptyTimeline, Timeline } from '@asap-hub/demo-timeline';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import supertest from 'supertest';
import {
  AssetRow,
  finishProgress,
  formatTimestamp,
  parseProgressMs,
  parseRenderEnv,
  renderProgress,
  spriteGrid,
  svgSourcePath,
  thumbnailsVtt,
  timelineAssetIds,
  toAssetRow,
  toRenderAssets,
  unmarshalItem,
  videoUpdateArgs,
} from '../encoder/render';
import { appFactory } from '../src/app';
import { userEntity, videoEntity } from '../src/data/entities';
import { setJobRunner } from '../src/jobs/runner';
import {
  isRenderActive,
  maxRenderAgeMs,
  nextMediaPath,
} from '../src/routes/render';
import * as storage from '../src/storage';
/* eslint-enable import/first */

jest.mock('../src/storage', () => ({
  ...jest.requireActual('../src/storage'),
  putObject: jest.fn(),
  getObjectText: jest.fn(),
}));

jest.mock('uuid', () => ({ v4: () => 'generated-render-id' }));

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
  durationMs: 0,
  chapters: [],
  s3Prefix: 'project-1',
  createdBy: { sub: 'auth0|creator', name: 'Ana' },
  version: 3,
  kind: 'studio',
  processingState: 'empty',
  lockedBy: 'auth0|creator',
  lockedByName: 'Ana',
  lockExpiresAt: Date.now() + 60_000,
  timeline: {
    key: 'projects/project-1/timeline/4.json',
    timelineVersion: 4,
    schemaVersion: 1,
    updatedAt: '2026-08-01T10:00:00.000Z',
  },
  createdAt: '2026-08-01T10:00:00.000Z',
  updatedAt: '2026-08-01T10:00:00.000Z',
  ...overrides,
});

const mockVideoGet = (data: Record<string, unknown> | null) => {
  jest.spyOn(videoEntity, 'get').mockReturnValue({
    go: async () => ({ data }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
};

const timelineWithClip = (): Timeline => ({
  ...createEmptyTimeline(),
  clips: [
    {
      kind: 'source',
      id: 'clip-1',
      assetId: 'asset-1',
      inMs: 0,
      outMs: 5000,
      volume: 1,
    },
  ],
});

const run = jest.fn();
const stop = jest.fn();

const setValue = (call: number, name: string): unknown =>
  mockSend.mock.calls[call]?.[0].input.ExpressionAttributeValues[`:${name}`];

beforeEach(() => {
  jest.restoreAllMocks();
  mockSend.mockReset().mockResolvedValue({});
  (storage.putObject as jest.Mock).mockReset().mockResolvedValue(undefined);
  (storage.getObjectText as jest.Mock)
    .mockReset()
    .mockResolvedValue(JSON.stringify(timelineWithClip()));
  run.mockReset().mockResolvedValue({ jobId: 'task-arn-1' });
  stop.mockReset().mockResolvedValue(undefined);
  setJobRunner({ run, stop });
});

afterAll(() => {
  setJobRunner(undefined);
});

describe('POST /api/projects/:id/render', () => {
  const start = (body: Record<string, unknown> = { version: 3 }) =>
    api
      .post('/api/projects/project-1/render')
      .set('Authorization', creatorToken)
      .send(body);

  it('snapshots the timeline and queues the render', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem());

    const response = await start();

    expect(response.status).toBe(200);
    expect(storage.putObject).toHaveBeenCalledWith(
      'projects/project-1/renders/generated-render-id/timeline.json',
      JSON.stringify(timelineWithClip()),
      'application/json',
      'lifecycle=render',
    );
    expect(setValue(0, 'render')).toMatchObject({
      renderId: 'generated-render-id',
      state: 'queued',
      timelineVersion: 4,
      progress: 0,
    });
    expect(setValue(0, 'expectedVersion')).toBe(3);
  });

  it('starts the render job and records the task it started', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem({ mediaPath: 'r2' }));

    await start();

    expect(run).toHaveBeenCalledWith('render', {
      JOB: 'render',
      VIDEO_ID: 'project-1',
      RENDER_ID: 'generated-render-id',
      TIMELINE_KEY:
        'projects/project-1/renders/generated-render-id/timeline.json',
      MEDIA_PATH: 'r3',
    });
    // the render map this request built is already stale by now: the container
    // may have written progress into it, so only taskArn moves, and only while
    // the row still names this run
    const tracked = mockSend.mock.calls[1]![0].input;
    expect(tracked.UpdateExpression).toBe(
      'SET #render.#taskArn = :taskArn ADD #version :one',
    );
    expect(tracked.ConditionExpression).toBe('#render.#renderId = :renderId');
    expect(tracked.ExpressionAttributeValues).toEqual({
      ':taskArn': 'task-arn-1',
      ':renderId': 'generated-render-id',
      ':one': 1,
    });
  });

  it('still answers when the row no longer names the render', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem());
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockSend.mockResolvedValueOnce({}).mockRejectedValueOnce(
      new ConditionalCheckFailedException({
        message: 'The conditional request failed',
        $metadata: {},
      }),
    );

    const response = await start();

    expect(response.status).toBe(200);
  });

  // Chapters describe the media, so they land with it. Writing them when the
  // export was queued retitled a published demo before the render existed, and
  // left it retitled if that render then failed.
  it('leaves the published chapters alone until the render lands', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem());
    const timeline = timelineWithClip();
    (storage.getObjectText as jest.Mock).mockResolvedValue(
      JSON.stringify({
        ...timeline,
        clips: [
          ...timeline.clips,
          {
            kind: 'title',
            id: 'title-1',
            preset: 'centered',
            text: 'Part two',
            durationMs: 2000,
          },
        ],
      }),
    );

    await start();

    expect(setValue(0, 'chapters')).toBeUndefined();
  });

  it('refuses a second render while one is active', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(
      projectItem({
        render: {
          renderId: 'render-0',
          state: 'rendering',
          timelineVersion: 4,
        },
      }),
    );

    const response = await start();

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'render_active' });
    expect(run).not.toHaveBeenCalled();
    expect(storage.putObject).not.toHaveBeenCalled();
  });

  // recordFailure only runs if the process survives, so a killed task leaves
  // 'rendering' behind for ever and every later export would 409 on it
  it('starts again once an active render is too old to still be running', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(
      projectItem({
        render: {
          renderId: 'render-0',
          state: 'rendering',
          timelineVersion: 4,
          requestedAt: new Date(
            Date.now() - maxRenderAgeMs - 1000,
          ).toISOString(),
        },
      }),
    );

    const response = await start();

    expect(response.status).toBe(200);
    expect(run).toHaveBeenCalled();
  });

  it('starts again once the last render finished', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(
      projectItem({
        render: { renderId: 'render-0', state: 'failed', timelineVersion: 4 },
      }),
    );

    const response = await start();

    expect(response.status).toBe(200);
    expect(run).toHaveBeenCalled();
  });

  it('refuses a timeline with no clips', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem());
    (storage.getObjectText as jest.Mock).mockResolvedValue(
      JSON.stringify(createEmptyTimeline()),
    );

    const response = await start();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'empty_timeline' });
    expect(run).not.toHaveBeenCalled();
  });

  it('refuses a project that has no timeline revision at all', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem({ timeline: undefined }));

    const response = await start();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'empty_timeline' });
  });

  it('marks the render failed when the job cannot be started', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem());
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    run.mockRejectedValue(new Error('no capacity'));

    const response = await start();

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ error: 'render_start_failed' });
    expect(setValue(1, 'render')).toMatchObject({ state: 'failed' });
  });

  it('is not found for a plain upload', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(projectItem({ kind: 'upload' }));

    expect((await start()).status).toBe(404);
  });

  it('refuses a member', async () => {
    mockUser('member', 'auth0|member');

    const response = await api
      .post('/api/projects/project-1/render')
      .set('Authorization', memberToken)
      .send({ version: 3 });

    expect(response.status).toBe(403);
    expect(run).not.toHaveBeenCalled();
  });
});

describe('DELETE /api/projects/:id/render', () => {
  const cancel = () =>
    api
      .delete('/api/projects/project-1/render')
      .set('Authorization', creatorToken)
      .send({ version: 3 });

  const rendering = (overrides: Record<string, unknown> = {}) =>
    projectItem({
      render: {
        renderId: 'render-0',
        state: 'rendering',
        timelineVersion: 4,
        taskArn: 'task-arn-1',
        ...overrides,
      },
    });

  it('stops the job and cancels the render', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(rendering());

    const response = await cancel();

    expect(response.status).toBe(200);
    expect(stop).toHaveBeenCalledWith('task-arn-1');
    expect(setValue(0, 'render')).toMatchObject({
      renderId: 'render-0',
      state: 'cancelled',
    });
  });

  it('cancels even when the task can no longer be stopped', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(rendering());
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    stop.mockRejectedValue(new Error('task already stopped'));

    const response = await cancel();

    expect(response.status).toBe(200);
    expect(setValue(0, 'render')).toMatchObject({ state: 'cancelled' });
  });

  it('refuses to cancel a render that is not running', async () => {
    mockUser('creator', 'auth0|creator');
    mockVideoGet(rendering({ state: 'done' }));

    const response = await cancel();

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'render_inactive' });
    expect(stop).not.toHaveBeenCalled();
  });

  it('refuses a member', async () => {
    mockUser('member', 'auth0|member');

    const response = await api
      .delete('/api/projects/project-1/render')
      .set('Authorization', memberToken)
      .send({ version: 3 });

    expect(response.status).toBe(403);
    expect(stop).not.toHaveBeenCalled();
  });
});

describe('isRenderActive', () => {
  const now = Date.parse('2026-08-01T12:00:00.000Z');
  const at = (offsetMs: number) => new Date(now - offsetMs).toISOString();

  it('counts a render the container is still plausibly running', () => {
    expect(
      isRenderActive(
        {
          renderId: 'render-0',
          state: 'rendering',
          timelineVersion: 4,
          requestedAt: at(60_000),
        },
        now,
      ),
    ).toBe(true);
  });

  // a task killed before it could report leaves 'rendering' on the row for
  // ever, and every later export would answer render_active off it
  it('counts one older than the longest render could be as over', () => {
    expect(
      isRenderActive(
        {
          renderId: 'render-0',
          state: 'rendering',
          timelineVersion: 4,
          requestedAt: at(maxRenderAgeMs + 1000),
        },
        now,
      ),
    ).toBe(false);
  });

  it('leaves a render with no requestedAt alone', () => {
    expect(
      isRenderActive(
        { renderId: 'render-0', state: 'queued', timelineVersion: 4 },
        now,
      ),
    ).toBe(true);
  });

  it('is false for a render that finished and for no render at all', () => {
    expect(
      isRenderActive(
        {
          renderId: 'render-0',
          state: 'done',
          timelineVersion: 4,
          requestedAt: at(0),
        },
        now,
      ),
    ).toBe(false);
    expect(isRenderActive(undefined, now)).toBe(false);
  });
});

describe('the writes the container makes', () => {
  const env = {
    videoId: 'project-1',
    renderId: 'render-1',
    timelineKey: 'projects/project-1/renders/render-1/timeline.json',
    mediaPath: 'r1',
    bucket: 'bucket',
    table: 'table',
    s3Endpoint: undefined,
    dynamodbEndpoint: undefined,
    workDir: '/scratch',
  };

  // the row changes materially on every one of these, and version is what the
  // editor reads to decide whether its copy is still current
  it('bumps the version alongside whatever it is writing', () => {
    const args = videoUpdateArgs(
      env,
      'SET #render.#state = :state',
      { '#state': 'state' },
      { ':state': { S: 'rendering' } },
    );

    const expression = args[args.indexOf('--update-expression') + 1];
    expect(expression).toBe('SET #render.#state = :state ADD #version :one');
    expect(
      JSON.parse(args[args.indexOf('--expression-attribute-names') + 1]!),
    ).toMatchObject({ '#version': 'version' });
    expect(
      JSON.parse(args[args.indexOf('--expression-attribute-values') + 1]!),
    ).toMatchObject({ ':one': { N: '1' } });
  });

  it('stays conditional on the item naming this run', () => {
    const args = videoUpdateArgs(env, 'SET durationMs = :d', {}, {});
    expect(args[args.indexOf('--condition-expression') + 1]).toBe(
      '#render.#renderId = :renderId',
    );
  });
});

describe('nextMediaPath', () => {
  it.each([
    [undefined, 'r1'],
    ['r1', 'r2'],
    ['r9', 'r10'],
    ['stream', 'r1'],
  ])('turns %s into %s', (current, expected) => {
    expect(nextMediaPath(current)).toBe(expected);
  });
});

describe('parseRenderEnv', () => {
  const complete = {
    VIDEO_ID: 'project-1',
    RENDER_ID: 'render-1',
    TIMELINE_KEY: 'projects/project-1/renders/render-1/timeline.json',
    MEDIA_PATH: 'r1',
    BUCKET_NAME: 'bucket',
    TABLE_NAME: 'table',
  };

  it('defaults the work directory and leaves the endpoints unset', () => {
    expect(parseRenderEnv(complete)).toEqual({
      videoId: 'project-1',
      renderId: 'render-1',
      timelineKey: 'projects/project-1/renders/render-1/timeline.json',
      mediaPath: 'r1',
      bucket: 'bucket',
      table: 'table',
      s3Endpoint: undefined,
      dynamodbEndpoint: undefined,
      workDir: '/scratch',
    });
  });

  it('takes the local endpoint overrides', () => {
    expect(
      parseRenderEnv({
        ...complete,
        S3_ENDPOINT: 'http://localhost:9010',
        DYNAMODB_ENDPOINT: 'http://localhost:8000',
        WORK_DIR: '/out',
      }),
    ).toMatchObject({
      s3Endpoint: 'http://localhost:9010',
      dynamodbEndpoint: 'http://localhost:8000',
      workDir: '/out',
    });
  });

  it.each(Object.keys(complete))('requires %s', (name) => {
    expect(() => parseRenderEnv({ ...complete, [name]: undefined })).toThrow(
      name,
    );
  });
});

describe('renderProgress', () => {
  it('shares the first 70% between the clips', () => {
    expect(renderProgress(0, 3, 0)).toBe(0);
    expect(renderProgress(0, 3, 1)).toBe(35);
    expect(renderProgress(1, 3, 0.5)).toBe(53);
    expect(renderProgress(1, 3, 1)).toBe(70);
  });

  it('gives the join 25% and the finishing stage the last 5%', () => {
    expect(renderProgress(2, 3, 0)).toBe(70);
    expect(renderProgress(2, 3, 1)).toBe(95);
    expect(finishProgress(0)).toBe(95);
    expect(finishProgress(1)).toBe(100);
  });

  it('never leaves the range a percentage lives in', () => {
    expect(renderProgress(0, 2, -1)).toBe(0);
    expect(renderProgress(1, 2, 4)).toBe(95);
    expect(renderProgress(0, 2, Number.NaN)).toBe(0);
  });
});

describe('parseProgressMs', () => {
  it('reads the last out_time of a chunk', () => {
    expect(
      parseProgressMs(
        [
          'out_time=00:00:01.500000',
          'progress=continue',
          'out_time=00:01:02.250000',
          'progress=continue',
        ].join('\n'),
      ),
    ).toBe(62250);
  });

  it('ignores a chunk that carries no out_time', () => {
    expect(parseProgressMs('frame=12\nfps=30\nprogress=continue')).toBe(
      undefined,
    );
  });
});

describe('the sprite sheet', () => {
  it('lays one tile per interval out in rows of ten', () => {
    expect(spriteGrid(95_000)).toEqual({
      tileCount: 95,
      columns: 10,
      rows: 10,
      intervalSeconds: 1,
    });
    expect(spriteGrid(0)).toEqual({
      tileCount: 1,
      columns: 1,
      rows: 1,
      intervalSeconds: 1,
    });
  });

  // a fixed ten second interval left a ten second demo with a single tile, so
  // the scrub preview showed one frame from end to end
  it('samples a short demo closely and a long one sparsely', () => {
    expect(spriteGrid(10_000).intervalSeconds).toBe(1);
    expect(spriteGrid(4 * 60 * 60 * 1000)).toMatchObject({
      tileCount: 100,
      intervalSeconds: 144,
    });
  });

  it('formats a timestamp the way WebVTT wants it', () => {
    expect(formatTimestamp(0)).toBe('00:00:00.000');
    expect(formatTimestamp(3_723_456)).toBe('01:02:03.456');
  });

  it('maps each cue to its tile, clipped to the real duration', () => {
    expect(
      thumbnailsVtt({
        tileCount: 2,
        columns: 10,
        rows: 1,
        tileHeight: 90,
        durationMs: 15_000,
        intervalSeconds: 10,
      }),
    ).toBe(
      [
        'WEBVTT',
        '',
        '00:00:00.000 --> 00:00:10.000',
        'sprite.jpg#xywh=0,0,160,90',
        '',
        '00:00:10.000 --> 00:00:15.000',
        'sprite.jpg#xywh=160,0,160,90',
        '',
        '',
      ].join('\n'),
    );
  });
});

describe('the assets a plan needs', () => {
  const item = {
    assetId: { S: 'asset-1' },
    key: { S: 'projects/project-1/assets/asset-1/original.webm' },
    proxyKey: { S: 'projects/project-1/assets/asset-1/proxy.mp4' },
    durationMs: { N: '5000' },
    width: { N: '1920' },
    height: { N: '1080' },
    fps: { N: '30' },
    hasAudio: { BOOL: false },
  };

  it('unmarshals what the aws cli hands back', () => {
    expect(unmarshalItem(item)).toMatchObject({
      assetId: 'asset-1',
      durationMs: 5000,
      hasAudio: false,
    });
  });

  it('needs an id and a key to make a row', () => {
    expect(toAssetRow(unmarshalItem(item))).toEqual({
      assetId: 'asset-1',
      key: 'projects/project-1/assets/asset-1/original.webm',
      durationMs: 5000,
      width: 1920,
      height: 1080,
      fps: 30,
      hasAudio: false,
    });
    expect(toAssetRow({ assetId: 'asset-1' })).toBe(undefined);
  });

  it('collects every asset the timeline references, once', () => {
    const timeline = timelineWithClip();
    expect(
      timelineAssetIds({
        ...timeline,
        clips: [...timeline.clips, ...timeline.clips],
        narration: [
          {
            id: 'take-1',
            assetId: 'asset-2',
            startMs: 0,
            inMs: 0,
            outMs: 1000,
            volume: 1,
          },
        ],
      }),
    ).toEqual(['asset-1', 'asset-2']);
  });

  it('renders the original, not the proxy, and drops what nothing references', () => {
    const rows: AssetRow[] = [
      { assetId: 'asset-1', key: 'a/original.webm', durationMs: 5000 },
      { assetId: 'asset-2', key: 'b/original.webm' },
    ];

    expect(
      toRenderAssets(rows, ['asset-1'], (assetId) => `/scratch/${assetId}`),
    ).toEqual([
      {
        assetId: 'asset-1',
        path: '/scratch/asset-1',
        durationMs: 5000,
        width: undefined,
        height: undefined,
        fps: undefined,
        hasAudio: undefined,
      },
    ]);
  });

  it('writes each overlay svg next to the png it rasterises to', () => {
    expect(svgSourcePath('/scratch/title-0.png')).toBe('/scratch/title-0.svg');
  });
});
