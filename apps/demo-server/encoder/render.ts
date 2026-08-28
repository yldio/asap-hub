import {
  buildRenderPlan,
  describePlan,
  layoutClips,
  parseTimeline,
  RenderAsset,
  RenderPlan,
  Timeline,
} from '@asap-hub/demo-timeline';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';

export type RenderEnv = {
  videoId: string;
  renderId: string;
  timelineKey: string;
  mediaPath: string;
  bucket: string;
  table: string;
  s3Endpoint?: string;
  dynamodbEndpoint?: string;
  workDir: string;
};

const requiredEnv = (env: NodeJS.ProcessEnv, name: string): string => {
  const value = env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
};

export const parseRenderEnv = (env: NodeJS.ProcessEnv): RenderEnv => ({
  videoId: requiredEnv(env, 'VIDEO_ID'),
  renderId: requiredEnv(env, 'RENDER_ID'),
  timelineKey: requiredEnv(env, 'TIMELINE_KEY'),
  mediaPath: requiredEnv(env, 'MEDIA_PATH'),
  bucket: requiredEnv(env, 'BUCKET_NAME'),
  table: requiredEnv(env, 'TABLE_NAME'),
  s3Endpoint: env.S3_ENDPOINT || undefined,
  dynamodbEndpoint: env.DYNAMODB_ENDPOINT || undefined,
  workDir: env.WORK_DIR || '/scratch',
});

export const spriteIntervalSeconds = 10;
export const spriteTileWidth = 160;
export const spriteColumns = 10;

export const maxErrorLength = 500;

export const truncateError = (error: unknown): string =>
  String(error instanceof Error ? error.message : error).slice(
    0,
    maxErrorLength,
  );

/* progress */

// clips share the first 70%, the join takes 25% and the finishing stage, which
// reports no progress of its own, is the last 5%
export const stepWeights = { clips: 70, join: 25, finish: 5 } as const;

const clamped = (fraction: number): number =>
  Math.min(1, Math.max(0, Number.isFinite(fraction) ? fraction : 0));

export const renderProgress = (
  stepIndex: number,
  stepCount: number,
  fraction: number,
): number => {
  const clipCount = Math.max(stepCount - 1, 0);
  if (stepIndex >= clipCount) {
    return Math.round(stepWeights.clips + clamped(fraction) * stepWeights.join);
  }
  const share = stepWeights.clips / clipCount;
  return Math.round(stepIndex * share + clamped(fraction) * share);
};

export const finishProgress = (fraction: number): number =>
  Math.round(
    stepWeights.clips +
      stepWeights.join +
      clamped(fraction) * stepWeights.finish,
  );

// -progress writes key=value lines; out_time is the only unambiguous elapsed
// field, because out_time_ms is really microseconds in most ffmpeg builds
export const parseProgressMs = (chunk: string): number | undefined => {
  const matches = [
    ...chunk.matchAll(/^out_time=(\d+):(\d{2}):(\d{2})\.(\d{1,6})$/gm),
  ];
  const last = matches[matches.length - 1];
  if (!last) {
    return undefined;
  }
  const hours = Number(last[1] ?? 0);
  const minutes = Number(last[2] ?? 0);
  const seconds = Number(last[3] ?? 0);
  const micros = Number((last[4] ?? '0').padEnd(6, '0'));
  return (
    ((hours * 60 + minutes) * 60 + seconds) * 1000 + Math.floor(micros / 1000)
  );
};

/* the sprite sheet and its WebVTT track, ported from finish.sh */

export type SpriteGrid = { tileCount: number; columns: number; rows: number };

export const spriteGrid = (durationMs: number): SpriteGrid => {
  const tileCount = Math.max(
    Math.ceil(durationMs / 1000 / spriteIntervalSeconds),
    1,
  );
  const columns = Math.min(spriteColumns, tileCount);
  return { tileCount, columns, rows: Math.ceil(tileCount / columns) };
};

const pad = (value: number, length: number): string =>
  String(value).padStart(length, '0');

export const formatTimestamp = (ms: number): string => {
  const whole = Math.floor(ms);
  const hours = pad(Math.floor(whole / 3600000), 2);
  const minutes = pad(Math.floor(whole / 60000) % 60, 2);
  const seconds = pad(Math.floor(whole / 1000) % 60, 2);
  return `${hours}:${minutes}:${seconds}.${pad(whole % 1000, 3)}`;
};

export type VttInput = SpriteGrid & { tileHeight: number; durationMs: number };

export const thumbnailsVtt = ({
  tileCount,
  columns,
  tileHeight,
  durationMs,
}: VttInput): string => {
  const cues = Array.from({ length: tileCount }, (_unused, index) => {
    const startMs = index * spriteIntervalSeconds * 1000;
    const endMs = Math.min(
      (index + 1) * spriteIntervalSeconds * 1000,
      durationMs,
    );
    const x = (index % columns) * spriteTileWidth;
    const y = Math.floor(index / columns) * tileHeight;
    return [
      `${formatTimestamp(startMs)} --> ${formatTimestamp(endMs)}`,
      `sprite.jpg#xywh=${x},${y},${spriteTileWidth},${tileHeight}`,
      '',
      '',
    ].join('\n');
  });
  return `WEBVTT\n\n${cues.join('')}`;
};

/* DynamoDB attribute values, as the aws cli hands them over */

export type AttributeValue = {
  S?: string;
  N?: string;
  BOOL?: boolean;
  L?: AttributeValue[];
  M?: Record<string, AttributeValue>;
};

export const unmarshalItem = (
  item: Record<string, AttributeValue>,
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(item).map(([name, value]) => [name, unmarshal(value)]),
  );

export const unmarshal = (value: AttributeValue): unknown => {
  if (value.S !== undefined) return value.S;
  if (value.N !== undefined) return Number(value.N);
  if (value.BOOL !== undefined) return value.BOOL;
  if (value.L) return value.L.map(unmarshal);
  if (value.M) return unmarshalItem(value.M);
  return undefined;
};

/* the assets a plan needs */

export type AssetRow = {
  assetId: string;
  key: string;
  durationMs?: number;
  width?: number;
  height?: number;
  fps?: number;
  hasAudio?: boolean;
};

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

const asNumber = (value: unknown): number | undefined =>
  typeof value === 'number' ? value : undefined;

const asBoolean = (value: unknown): boolean | undefined =>
  typeof value === 'boolean' ? value : undefined;

export const toAssetRow = (
  item: Record<string, unknown>,
): AssetRow | undefined => {
  const assetId = asString(item.assetId);
  const key = asString(item.key);
  if (!assetId || !key) {
    return undefined;
  }
  return {
    assetId,
    key,
    durationMs: asNumber(item.durationMs),
    width: asNumber(item.width),
    height: asNumber(item.height),
    fps: asNumber(item.fps),
    hasAudio: asBoolean(item.hasAudio),
  };
};

export const timelineAssetIds = (timeline: Timeline): string[] => [
  ...new Set([
    ...timeline.clips.flatMap((clip) =>
      clip.kind === 'source' ? [clip.assetId] : [],
    ),
    ...timeline.narration.map((take) => take.assetId),
  ]),
];

// the render reads the original the browser uploaded, never proxyKey: the proxy
// is an editing convenience and may be a lower quality transcode of the source
export const toRenderAssets = (
  rows: AssetRow[],
  assetIds: string[],
  localPath: (assetId: string) => string,
): RenderAsset[] =>
  rows
    .filter((row) => assetIds.includes(row.assetId))
    .map((row) => ({
      assetId: row.assetId,
      path: localPath(row.assetId),
      durationMs: row.durationMs ?? 0,
      width: row.width,
      height: row.height,
      fps: row.fps,
      hasAudio: row.hasAudio,
    }));

export const svgSourcePath = (pngPath: string): string =>
  `${pngPath.replace(/\.png$/, '')}.svg`;

// every clip step renders one placement, the last step is the join, so the
// programme duration is what the join is measured against
export const stepDurationsMs = (
  timeline: Timeline,
  plan: RenderPlan,
): number[] => [
  ...layoutClips(timeline.clips).map((placement) => placement.durationMs),
  plan.durationMs,
];

/* everything below talks to the outside world */

const log = (message: string): void => {
  process.stdout.write(`${new Date().toISOString()} ${message}\n`);
};

const maxStderrLength = 4000;

const run = (
  command: string,
  args: string[],
  onStdout?: (chunk: string) => void,
): Promise<string> =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (chunk: Buffer) => {
      const text = chunk.toString();
      if (onStdout) {
        onStdout(text);
      } else {
        stdout += text;
      }
    });
    child.stderr?.on('data', (chunk: Buffer) => {
      stderr = (stderr + chunk.toString()).slice(-maxStderrLength);
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
        return;
      }
      reject(new Error(`${command} exited ${code}: ${stderr.trim()}`));
    });
  });

const aws = (
  endpoint: string | undefined,
  args: string[],
  onStdout?: (chunk: string) => void,
): Promise<string> =>
  run('aws', endpoint ? ['--endpoint-url', endpoint, ...args] : args, onStdout);

const s3 = (env: RenderEnv, args: string[]): Promise<string> =>
  aws(env.s3Endpoint, ['s3', ...args]);

const dynamodb = (env: RenderEnv, args: string[]): Promise<string> =>
  aws(env.dynamodbEndpoint, ['dynamodb', ...args]);

const objectUri = (env: RenderEnv, key: string): string =>
  `s3://${env.bucket}/${key}`;

const download = (env: RenderEnv, key: string, path: string): Promise<string> =>
  s3(env, ['cp', objectUri(env, key), path]);

const upload = (
  env: RenderEnv,
  path: string,
  key: string,
  contentType: string,
): Promise<string> =>
  s3(env, ['cp', path, objectUri(env, key), '--content-type', contentType]);

const videoKeyJson = (env: RenderEnv): string =>
  JSON.stringify({ PK: { S: `VIDEO#${env.videoId}` }, SK: { S: 'META' } });

// a superseded render must never clobber a newer one, so every write this
// container makes is conditional on the item still naming this run
const updateVideo = (
  env: RenderEnv,
  expression: string,
  names: Record<string, string>,
  values: Record<string, AttributeValue>,
): Promise<string> =>
  dynamodb(env, [
    'update-item',
    '--table-name',
    env.table,
    '--key',
    videoKeyJson(env),
    '--update-expression',
    expression,
    '--condition-expression',
    '#render.#renderId = :renderId',
    '--expression-attribute-names',
    JSON.stringify({ '#render': 'render', '#renderId': 'renderId', ...names }),
    '--expression-attribute-values',
    JSON.stringify({ ':renderId': { S: env.renderId }, ...values }),
  ]);

const queryAssetRows = async (env: RenderEnv): Promise<AssetRow[]> => {
  const response = await dynamodb(env, [
    'query',
    '--table-name',
    env.table,
    '--key-condition-expression',
    '#pk = :pk AND begins_with(#sk, :sk)',
    '--expression-attribute-names',
    JSON.stringify({ '#pk': 'PK', '#sk': 'SK' }),
    '--expression-attribute-values',
    JSON.stringify({
      ':pk': { S: `VIDEO#${env.videoId}` },
      ':sk': { S: 'ASSET#' },
    }),
    '--output',
    'json',
  ]);
  const { Items = [] } = JSON.parse(response) as {
    Items?: Record<string, AttributeValue>[];
  };
  return Items.map(unmarshalItem)
    .map(toAssetRow)
    .filter((row): row is AssetRow => Boolean(row));
};

const progressIntervalMs = 5000;

// progress is advisory: a write that loses the condition, or fails outright,
// must not end a render that is otherwise going fine
const createReporter = (env: RenderEnv) => {
  let reportedAt = 0;

  return (stage: string, progress: number): void => {
    const now = Date.now();
    if (now - reportedAt < progressIntervalMs) {
      return;
    }
    reportedAt = now;
    void updateVideo(
      env,
      'SET #render.#state = :state, #render.#stage = :stage, #render.#progress = :progress',
      { '#state': 'state', '#stage': 'stage', '#progress': 'progress' },
      {
        ':state': { S: 'rendering' },
        ':stage': { S: stage },
        ':progress': { N: String(progress) },
      },
    ).catch((error: unknown) => {
      log(`WARN could not report progress: ${truncateError(error)}`);
    });
  };
};

type Reporter = ReturnType<typeof createReporter>;

const probe = async (args: string[]): Promise<string> =>
  (await run('ffprobe', args)).trim();

const probeDurationMs = async (path: string): Promise<number> => {
  const seconds = await probe([
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'csv=p=0',
    path,
  ]);
  return Math.round(Number(seconds) * 1000);
};

const rasterise = async (
  plan: RenderPlan,
  svgs: RenderPlan['svgs'],
): Promise<void> => {
  await Promise.all(
    svgs.map(async ({ path, svg }) => {
      const source = svgSourcePath(path);
      await fs.writeFile(source, svg, 'utf8');
      await run('rsvg-convert', [
        '-w',
        String(plan.canvas.width),
        '-h',
        String(plan.canvas.height),
        '-o',
        path,
        source,
      ]);
    }),
  );
};

const runPlan = async (
  plan: RenderPlan,
  durations: number[],
  report: Reporter,
): Promise<void> => {
  for (const [index, step] of plan.steps.entries()) {
    log(`${index + 1}/${plan.steps.length} ${step.label}`);
    report(step.label, renderProgress(index, plan.steps.length, 0));

    const durationMs = durations[index] ?? plan.durationMs;
    // the progress options are global, so they go ahead of the planned args
    await run(
      'ffmpeg',
      ['-progress', 'pipe:1', '-nostats', ...step.args],
      (chunk) => {
        const elapsedMs = parseProgressMs(chunk);
        if (elapsedMs !== undefined) {
          report(
            step.label,
            renderProgress(index, plan.steps.length, elapsedMs / durationMs),
          );
        }
      },
    );
  }
};

// the upload path's finishing stage, ported from finish.sh: the same four
// artefacts under the same names, and the same ready flip. It is ported rather
// than sourced because a render writes under media/{id}/{mediaPath}/, which
// finish.sh has no revision directory for, and because the ready flip has to
// carry render.state and mediaPath in the one conditional write
const finishMedia = async (
  env: RenderEnv,
  streamFile: string,
  report: Reporter,
): Promise<number> => {
  const { workDir } = env;
  const spriteFile = `${workDir}/sprite.jpg`;
  const vttFile = `${workDir}/thumbnails.vtt`;
  const thumbFile = `${workDir}/thumb.jpg`;

  const durationMs = await probeDurationMs(streamFile);
  if (durationMs <= 0) {
    throw new Error('the rendered output reports no duration');
  }

  const grid = spriteGrid(durationMs);
  log(
    `sprite ${grid.tileCount} tiles, ${grid.columns}x${grid.rows} grid at ${spriteTileWidth}px wide`,
  );
  report('sprite', finishProgress(0.2));
  await run('ffmpeg', [
    '-nostdin',
    '-y',
    '-i',
    streamFile,
    '-frames:v',
    '1',
    '-vf',
    `fps=1/${spriteIntervalSeconds},scale=${spriteTileWidth}:-2,tile=${grid.columns}x${grid.rows}`,
    '-q:v',
    '4',
    spriteFile,
  ]);

  // a missing poster frame must never fail a render that is otherwise done
  const posterSeconds = ((durationMs / 1000) * 0.25).toFixed(3);
  const poster = await run('ffmpeg', [
    '-nostdin',
    '-y',
    '-ss',
    posterSeconds,
    '-i',
    streamFile,
    '-frames:v',
    '1',
    '-vf',
    'scale=640:-2',
    '-q:v',
    '4',
    thumbFile,
  ]).then(
    () => true,
    (error: unknown) => {
      log(`WARN could not build thumb.jpg: ${truncateError(error)}`);
      return false;
    },
  );

  const spriteHeight = Number(
    await probe([
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=height',
      '-of',
      'csv=p=0',
      spriteFile,
    ]),
  );
  const tileHeight = Math.floor(spriteHeight / grid.rows);
  await fs.writeFile(
    vttFile,
    thumbnailsVtt({ ...grid, tileHeight, durationMs }),
    'utf8',
  );

  const prefix = `media/${env.videoId}/${env.mediaPath}`;
  report('upload', finishProgress(0.6));
  await upload(env, streamFile, `${prefix}/stream.mp4`, 'video/mp4');
  await upload(env, spriteFile, `${prefix}/sprite.jpg`, 'image/jpeg');
  await upload(env, vttFile, `${prefix}/thumbnails.vtt`, 'text/vtt');
  if (poster) {
    await upload(env, thumbFile, `${prefix}/thumb.jpg`, 'image/jpeg').catch(
      (error: unknown) => {
        log(`WARN could not upload thumb.jpg: ${truncateError(error)}`);
      },
    );
  }

  return durationMs;
};

const render = async (env: RenderEnv): Promise<void> => {
  const { workDir } = env;
  const report = createReporter(env);
  log(
    `start videoId=${env.videoId} renderId=${env.renderId} mediaPath=${env.mediaPath}`,
  );

  await fs.mkdir(`${workDir}/assets`, { recursive: true });
  const timelineFile = `${workDir}/timeline.json`;
  await download(env, env.timelineKey, timelineFile);
  const timeline = parseTimeline(
    JSON.parse(await fs.readFile(timelineFile, 'utf8')),
  );

  const assetIds = timelineAssetIds(timeline);
  const localPath = (assetId: string): string => `${workDir}/assets/${assetId}`;
  const rows = await queryAssetRows(env);
  const assets = toRenderAssets(rows, assetIds, localPath);

  report('sources', 0);
  for (const row of rows.filter(({ assetId }) => assetIds.includes(assetId))) {
    log(`download ${row.key}`);
    await download(env, row.key, localPath(row.assetId));
  }

  const output = `${workDir}/stream.mp4`;
  const plan = buildRenderPlan({ timeline, assets, workDir, output });
  if (plan.steps.length === 0) {
    throw new Error('the timeline has no clips');
  }
  describePlan(plan).forEach(log);

  await rasterise(plan, plan.svgs);
  if (plan.listFile) {
    await fs.writeFile(plan.listFile.path, plan.listFile.content, 'utf8');
  }

  await runPlan(plan, stepDurationsMs(timeline, plan), report);
  const durationMs = await finishMedia(env, output, report);

  await updateVideo(
    env,
    [
      'SET durationMs = :durationMs, processingState = :processingState,',
      'mediaPath = :mediaPath, #render.#state = :state,',
      '#render.#stage = :stage, #render.#progress = :progress,',
      '#render.#finishedAt = :finishedAt',
      'REMOVE processingError, #render.#error',
    ].join(' '),
    {
      '#state': 'state',
      '#stage': 'stage',
      '#progress': 'progress',
      '#finishedAt': 'finishedAt',
      '#error': 'error',
    },
    {
      ':durationMs': { N: String(durationMs) },
      ':processingState': { S: 'ready' },
      ':mediaPath': { S: env.mediaPath },
      ':state': { S: 'done' },
      ':stage': { S: 'done' },
      ':progress': { N: '100' },
      ':finishedAt': { S: new Date().toISOString() },
    },
  );

  log(`done videoId=${env.videoId} durationMs=${durationMs}`);
};

// the media already published stays untouched: only the render map moves, so a
// failed re-render leaves the watch page on the output it had
const recordFailure = async (env: RenderEnv, error: unknown): Promise<void> => {
  await updateVideo(
    env,
    'SET #render.#state = :state, #render.#error = :error, #render.#finishedAt = :finishedAt',
    { '#state': 'state', '#error': 'error', '#finishedAt': 'finishedAt' },
    {
      ':state': { S: 'failed' },
      ':error': { S: truncateError(error) },
      ':finishedAt': { S: new Date().toISOString() },
    },
  ).catch((writeError: unknown) => {
    log(`WARN could not record the failure: ${truncateError(writeError)}`);
  });
};

export const main = async (): Promise<void> => {
  const env = parseRenderEnv(process.env);
  try {
    await render(env);
  } catch (error) {
    await recordFailure(env, error);
    throw error;
  }
};

if (require.main === module) {
  main().catch((error: unknown) => {
    log(`FAILED ${truncateError(error)}`);
    process.exitCode = 1;
  });
}
