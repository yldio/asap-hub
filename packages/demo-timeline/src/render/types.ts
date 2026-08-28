import { Canvas } from '../schema';

export type RenderAsset = {
  assetId: string;
  path: string;
  durationMs: number;
  width?: number;
  height?: number;
  fps?: number;
  // left undefined by an asset the ingest job has not probed yet
  hasAudio?: boolean;
};

export type FfmpegStep = { label: string; args: string[]; output: string };

export type SvgFile = { path: string; svg: string };

export type ConcatListFile = { path: string; content: string };

export type RenderPlan = {
  canvas: Canvas;
  durationMs: number;
  steps: FfmpegStep[];
  output: string;
  svgs: SvgFile[];
  listFile?: ConcatListFile;
};
