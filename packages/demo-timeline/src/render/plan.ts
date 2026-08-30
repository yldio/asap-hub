import {
  layoutClips,
  placementsDurationMs,
  timelineDurationMs,
} from '../clips';
import { Timeline } from '../schema';
import { assetIndex } from './assets';
import { buildClipStep } from './clipSteps';
import { buildJoinStep } from './joinStep';
import { buildAssembleStep, shiftZoomsForTile, tilePlacements } from './tiles';
import {
  ConcatListFile,
  FfmpegStep,
  RenderAsset,
  RenderPlan,
  SvgFile,
} from './types';

export const renderDurationMs = (timeline: Timeline): number =>
  timelineDurationMs(timeline.clips);

// a banner spanning a transition is overlaid on every clip it reaches, and each
// of those clips asks for the same file, so the caller rasterises it once
const uniqueByPath = (svgs: SvgFile[]): SvgFile[] => [
  ...new Map(svgs.map((svg) => [svg.path, svg])).values(),
];

export type RenderPlanInput = {
  timeline: Timeline;
  assets: RenderAsset[];
  workDir: string;
  output: string;
};

export const buildRenderPlan = ({
  timeline,
  assets,
  workDir,
  output,
}: RenderPlanInput): RenderPlan => {
  const { canvas, banners, narration, cursor, zooms } = timeline;
  const placements = layoutClips(timeline.clips);
  const durationMs = placementsDurationMs(placements);
  const index = assetIndex(assets);

  if (placements.length === 0) {
    return { canvas, durationMs, steps: [], output, svgs: [] };
  }

  // a long clip encodes as tiles so the pool can chew it in parallel; tile
  // indices continue past the real clips so no output or art path collides
  let nextTileIndex = placements.length;
  const takeIndex = () => {
    const at = nextTileIndex;
    nextTileIndex += 1;
    return at;
  };

  const encodeSteps: FfmpegStep[] = [];
  const assembleSteps: FfmpegStep[] = [];
  const listFiles: ConcatListFile[] = [];
  const svgs: SvgFile[] = [];

  placements.forEach((placement) => {
    const tiles = tilePlacements(placement, index, takeIndex);
    const whole = tiles.length === 1;
    tiles.forEach((tile) => {
      const built = buildClipStep({
        placement: whole ? placement : tile.placement,
        canvas,
        banners,
        cursor,
        zooms: shiftZoomsForTile(zooms, placement.clip.id, tile.shiftMs),
        assets: index,
        workDir,
      });
      encodeSteps.push({
        ...built.step,
        weightMs: whole ? placement.durationMs : tile.placement.durationMs,
      });
      svgs.push(...built.svgs);
    });
    if (!whole) {
      const assembled = buildAssembleStep(placement.index, tiles, workDir);
      assembleSteps.push(assembled.step);
      listFiles.push(assembled.listFile);
    }
  });

  const join = buildJoinStep({
    placements,
    canvas,
    narration,
    assets: index,
    durationMs,
    workDir,
    output,
  });

  return {
    canvas,
    durationMs,
    steps: [
      ...encodeSteps,
      ...assembleSteps,
      { ...join.step, serial: true, weightMs: durationMs },
    ],
    output,
    svgs: uniqueByPath(svgs),
    ...(join.listFile ? { listFile: join.listFile } : {}),
    ...(listFiles.length > 0 ? { listFiles } : {}),
  };
};

export const describePlan = (plan: RenderPlan): string[] =>
  plan.steps.map(
    (step, position) =>
      `${position + 1}/${plan.steps.length} ${step.label} -> ${step.output}`,
  );
