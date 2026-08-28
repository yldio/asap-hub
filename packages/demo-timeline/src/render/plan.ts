import {
  layoutClips,
  placementsDurationMs,
  timelineDurationMs,
} from '../clips';
import { Timeline } from '../schema';
import { assetIndex } from './assets';
import { buildClipStep } from './clipSteps';
import { buildJoinStep } from './joinStep';
import { RenderAsset, RenderPlan, SvgFile } from './types';

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
  const { canvas, banners, narration, zooms } = timeline;
  const placements = layoutClips(timeline.clips);
  const durationMs = placementsDurationMs(placements);
  const index = assetIndex(assets);

  if (placements.length === 0) {
    return { canvas, durationMs, steps: [], output, svgs: [] };
  }

  const clips = placements.map((placement) =>
    buildClipStep({
      placement,
      canvas,
      banners,
      zooms,
      assets: index,
      workDir,
    }),
  );
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
    steps: [...clips.map(({ step }) => step), join.step],
    output,
    svgs: uniqueByPath(clips.flatMap(({ svgs }) => svgs)),
    ...(join.listFile ? { listFile: join.listFile } : {}),
  };
};

export const describePlan = (plan: RenderPlan): string[] =>
  plan.steps.map(
    (step, position) =>
      `${position + 1}/${plan.steps.length} ${step.label} -> ${step.output}`,
  );
