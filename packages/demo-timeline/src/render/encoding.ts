import { Canvas } from '../schema';
import { chain } from './filters';

export const startArgs = ['-nostdin', '-y'];

// a fixed GOP keeps every clip cuttable at the same cadence, which is what
// makes the stage two concat able to copy the video stream untouched
export const videoEncodeArgs = (canvas: Canvas): string[] => [
  '-fps_mode',
  'cfr',
  '-r',
  String(canvas.fps),
  '-c:v',
  'libx264',
  '-preset',
  'medium',
  '-crf',
  '20',
  '-g',
  '60',
  '-keyint_min',
  '60',
  '-sc_threshold',
  '0',
  '-pix_fmt',
  'yuv420p',
];

export const audioCodecArgs = ['-c:a', 'aac', '-b:a', '128k'];

export const audioEncodeArgs = (filters: string[]): string[] => [
  ...audioCodecArgs,
  '-af',
  chain(filters),
];

export const containerArgs = ['-movflags', '+faststart'];

export const silentAudioInput = (durationMs: string): string[] => [
  '-f',
  'lavfi',
  '-t',
  durationMs,
  '-i',
  'anullsrc=channel_layout=stereo:sample_rate=48000',
];

export const imageInput = (durationMs: string, path: string): string[] => [
  '-loop',
  '1',
  '-t',
  durationMs,
  '-i',
  path,
];
