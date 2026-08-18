import { spawn } from 'child_process';
import { createWriteStream, promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import { videoEntity } from './data/entities';
import { getObject, mediaPrefix, putObject, rawKey } from './storage';

const spriteIntervalSeconds = 10;
const spriteTileWidth = 160;
const spriteColumns = 10;

const run = (
  command: string,
  args: string[],
): Promise<{ code: number; stdout: string; stderr: string }> =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', reject);
    child.on('close', (code) => resolve({ code: code ?? 1, stdout, stderr }));
  });

const hasBinary = async (command: string): Promise<boolean> => {
  try {
    const { code } = await run(command, ['-version']);
    return code === 0;
  } catch {
    return false;
  }
};

const formatTimestamp = (totalMs: number): string => {
  const hours = Math.floor(totalMs / 3600000);
  let rest = totalMs - hours * 3600000;
  const minutes = Math.floor(rest / 60000);
  rest -= minutes * 60000;
  const seconds = Math.floor(rest / 1000);
  const ms = rest - seconds * 1000;
  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    `${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`,
  ].join(':');
};

export const buildThumbnailsVtt = ({
  durationMs,
  tileCount,
  columns,
  tileHeight,
}: {
  durationMs: number;
  tileCount: number;
  columns: number;
  tileHeight: number;
}): string => {
  const lines = ['WEBVTT', ''];
  for (let index = 0; index < tileCount; index += 1) {
    const startMs = index * spriteIntervalSeconds * 1000;
    const endMs = Math.min(
      (index + 1) * spriteIntervalSeconds * 1000,
      durationMs,
    );
    const x = (index % columns) * spriteTileWidth;
    const y = Math.floor(index / columns) * tileHeight;
    lines.push(`${formatTimestamp(startMs)} --> ${formatTimestamp(endMs)}`);
    lines.push(`sprite.jpg#xywh=${x},${y},${spriteTileWidth},${tileHeight}`);
    lines.push('');
  }
  return lines.join('\n');
};

export const spriteGrid = (
  durationMs: number,
): { tileCount: number; columns: number; rows: number } => {
  const durationSeconds = durationMs / 1000;
  let tileCount = Math.floor(durationSeconds / spriteIntervalSeconds);
  if (durationSeconds > tileCount * spriteIntervalSeconds) {
    tileCount += 1;
  }
  if (tileCount < 1) {
    tileCount = 1;
  }
  const columns = Math.min(spriteColumns, tileCount);
  const rows = Math.ceil(tileCount / columns);
  return { tileCount, columns, rows };
};

const probeDurationMs = async (input: string): Promise<number> => {
  const { code, stdout } = await run('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'csv=p=0',
    input,
  ]);
  const seconds = Number(stdout.trim());
  if (code !== 0 || !Number.isFinite(seconds) || seconds <= 0) {
    return 0;
  }
  return Math.round(seconds * 1000);
};

const probeHeight = async (input: string): Promise<number> => {
  const { code, stdout } = await run('ffprobe', [
    '-v',
    'error',
    '-select_streams',
    'v:0',
    '-show_entries',
    'stream=height',
    '-of',
    'csv=p=0',
    input,
  ]);
  const height = Number(stdout.trim());
  return code === 0 && Number.isFinite(height) ? height : 0;
};

const encodeWithFfmpeg = async (
  workDir: string,
  inputFile: string,
): Promise<{ durationMs: number; sprites: boolean }> => {
  const streamFile = join(workDir, 'stream.mp4');
  const spriteFile = join(workDir, 'sprite.jpg');
  const vttFile = join(workDir, 'thumbnails.vtt');

  const encoded = await run('ffmpeg', [
    '-nostdin',
    '-y',
    '-i',
    inputFile,
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '24',
    '-g',
    '60',
    '-keyint_min',
    '60',
    '-sc_threshold',
    '0',
    '-c:a',
    'aac',
    '-b:a',
    '128k',
    '-movflags',
    '+faststart',
    streamFile,
  ]);
  if (encoded.code !== 0) {
    throw new Error(`ffmpeg failed: ${encoded.stderr.slice(-500)}`);
  }

  const durationMs = await probeDurationMs(inputFile);
  const { tileCount, columns, rows } = spriteGrid(durationMs);

  const sprited = await run('ffmpeg', [
    '-nostdin',
    '-y',
    '-i',
    inputFile,
    '-frames:v',
    '1',
    '-vf',
    `fps=1/${spriteIntervalSeconds},scale=${spriteTileWidth}:-2,tile=${columns}x${rows}`,
    '-q:v',
    '4',
    spriteFile,
  ]);

  let sprites = false;
  if (sprited.code === 0) {
    const spriteHeight = await probeHeight(spriteFile);
    const tileHeight = rows > 0 ? Math.floor(spriteHeight / rows) : 0;
    if (tileHeight > 0) {
      await fs.writeFile(
        vttFile,
        buildThumbnailsVtt({ durationMs, tileCount, columns, tileHeight }),
      );
      sprites = true;
    }
  }

  return { durationMs, sprites };
};

const uploadArtefacts = async (
  videoId: string,
  workDir: string,
  sprites: boolean,
): Promise<void> => {
  const prefix = mediaPrefix(videoId);
  await putObject(
    `${prefix}stream.mp4`,
    await fs.readFile(join(workDir, 'stream.mp4')),
    'video/mp4',
  );
  if (sprites) {
    await putObject(
      `${prefix}sprite.jpg`,
      await fs.readFile(join(workDir, 'sprite.jpg')),
      'image/jpeg',
    );
    await putObject(
      `${prefix}thumbnails.vtt`,
      await fs.readFile(join(workDir, 'thumbnails.vtt')),
      'text/vtt',
    );
  }
};

export const encodeLocally = async (videoId: string): Promise<void> => {
  const workDir = await fs.mkdtemp(join(tmpdir(), `demo-encode-${videoId}-`));
  try {
    const inputFile = join(workDir, 'original');
    const raw = await getObject(rawKey(videoId));
    await pipeline(raw.body, createWriteStream(inputFile));

    let durationMs = 0;
    let sprites = false;

    if (await hasBinary('ffmpeg')) {
      const result = await encodeWithFfmpeg(workDir, inputFile);
      durationMs = result.durationMs;
      sprites = result.sprites;
    } else {
      await fs.copyFile(inputFile, join(workDir, 'stream.mp4'));
    }

    await uploadArtefacts(videoId, workDir, sprites);

    await videoEntity
      .patch({ id: videoId })
      .set({ durationMs, processingState: 'ready' })
      .remove(['processingError'])
      .go();
  } catch (error) {
    await videoEntity
      .patch({ id: videoId })
      .set({
        processingState: 'failed',
        processingError: String(
          error instanceof Error ? error.message : error,
        ).slice(0, 500),
      })
      .go()
      .catch(() => undefined);
  } finally {
    await fs
      .rm(workDir, { recursive: true, force: true })
      .catch(() => undefined);
  }
};

export const startLocalEncode = (videoId: string): void => {
  void encodeLocally(videoId).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(`local encode for ${videoId} failed`, error);
  });
};
