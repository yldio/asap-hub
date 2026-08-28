import { Canvas, chooseCanvas, Clip } from '@asap-hub/demo-timeline';
import { ProjectAsset } from '../../api/types';

// A source the ingest is still preparing carries no format at all, and handing
// one to the chooser answered 1080p30 for footage that turned out to be 4K60.
const probed = (assets: (ProjectAsset | undefined)[]): ProjectAsset[] =>
  assets.filter((asset): asset is ProjectAsset => Boolean(asset?.height));

export const canvasForAssets = (
  assets: (ProjectAsset | undefined)[],
): Canvas | undefined => {
  const known = probed(assets);
  return known.length === 0 ? undefined : chooseCanvas(known);
};

export const assetsOnTimeline = (
  clips: Clip[],
  assets: Record<string, ProjectAsset>,
): (ProjectAsset | undefined)[] =>
  clips.flatMap((clip) =>
    clip.kind === 'source' ? [assets[clip.assetId]] : [],
  );

export const sameCanvas = (one: Canvas, other: Canvas): boolean =>
  one.width === other.width &&
  one.height === other.height &&
  one.fps === other.fps;

// The probe lands long after the clip was added, so the choice has to be made
// again. It only ever raises: dropping a 4K project to 1080p because one small
// source was probed last would throw away picture nobody asked to lose.
export const raiseCanvas = (current: Canvas, wanted: Canvas): Canvas => {
  const fps = (
    wanted.fps > current.fps ? wanted.fps : current.fps
  ) as Canvas['fps'];
  return wanted.height > current.height
    ? { width: wanted.width, height: wanted.height, fps }
    : { ...current, fps };
};
