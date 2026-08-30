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

// the art's own size, because a click ring is rasterised at its bounding box
// rather than over the whole canvas
export type SvgFile = {
  path: string;
  svg: string;
  width: number;
  height: number;
};

export type ConcatListFile = { path: string; content: string };

export type RenderPlan = {
  canvas: Canvas;
  durationMs: number;
  steps: FfmpegStep[];
  output: string;
  svgs: SvgFile[];
  listFile?: ConcatListFile;
};
