import { layoutClips } from '../../clips';
import { SourceClip, Timeline } from '../../schema';
import { createEmptyTimeline } from '../../document';
import { buildRenderPlan } from '../plan';
import {
  shiftZoomsForTile,
  tilePlacements,
  tileSpans,
  tileTargetMs,
  tileThresholdMs,
} from '../tiles';
import { RenderAsset } from '../types';

const longClip = (outMs: number): SourceClip => ({
  kind: 'source',
  id: 'clip-long',
  assetId: 'asset-long',
  inMs: 0,
  outMs,
  volume: 1,
});

const longAsset = (durationMs: number): RenderAsset[] => [
  {
    assetId: 'asset-long',
    path: '/media/long.mp4',
    durationMs,
    hasAudio: true,
  },
];

const planFor = (outMs: number, overrides: Partial<Timeline> = {}) =>
  buildRenderPlan({
    timeline: {
      ...createEmptyTimeline(),
      clips: [longClip(outMs)],
      ...overrides,
    },
    assets: longAsset(outMs),
    workDir: '/work',
    output: '/work/out.mp4',
  });

describe('tileSpans', () => {
  it('leaves a clip under the threshold whole', () => {
    expect(tileSpans(tileThresholdMs)).toEqual([
      { startMs: 0, endMs: tileThresholdMs },
    ]);
  });

  it('cuts even tiles and folds a short stub into the one before', () => {
    expect(tileSpans(130_000)).toEqual([
      { startMs: 0, endMs: 60_000 },
      { startMs: 60_000, endMs: 130_000 },
    ]);
  });

  it('keeps a tail long enough to stand on its own', () => {
    expect(tileSpans(145_000)).toEqual([
      { startMs: 0, endMs: 60_000 },
      { startMs: 60_000, endMs: 120_000 },
      { startMs: 120_000, endMs: 145_000 },
    ]);
  });
});

describe('tilePlacements', () => {
  const placementOf = () => {
    const [placement] = layoutClips([longClip(200_000)]);
    if (!placement) {
      throw new Error('expected a placement');
    }
    return placement;
  };
  const assetsOf = (durationMs: number) => {
    const [asset] = longAsset(durationMs);
    if (!asset) {
      throw new Error('expected an asset');
    }
    return new Map([['asset-long', asset]]);
  };

  it('cuts the clip into placements that read as clips of their own', () => {
    const tiles = tilePlacements(
      placementOf(),
      assetsOf(200_000),
      (() => {
        let at = 1;
        return () => {
          at += 1;
          return at;
        };
      })(),
    );

    expect(tiles.map(({ placement: tile }) => tile.clip)).toMatchObject([
      { inMs: 0, outMs: 60_000 },
      { inMs: 60_000, outMs: 120_000 },
      { inMs: 120_000, outMs: 180_000 },
      { inMs: 180_000, outMs: 200_000 },
    ]);
    expect(tiles.map(({ shiftMs }) => shiftMs)).toEqual([
      0, 60_000, 120_000, 180_000,
    ]);
  });

  // a tile that starts past the footage would be an empty input; the last real
  // tile stretches to the clip end and its held tail covers the rest
  it('stops the boundaries at the footage and holds the rest', () => {
    const tiles = tilePlacements(placementOf(), assetsOf(100_000), () => 9);

    const last = tiles[tiles.length - 1]?.placement.clip as SourceClip;
    expect(tiles).toHaveLength(2);
    expect(last.outMs).toBe(200_000);
  });
});

describe('shiftZoomsForTile', () => {
  it('speaks the tile time for the clip and leaves other clips alone', () => {
    const zooms = [
      {
        id: 'z1',
        clipId: 'clip-long',
        startMs: 70_000,
        rampInMs: 400,
        holdMs: 1000,
        rampOutMs: 400,
        focus: { x: 0.5, y: 0.5 },
        scale: 2,
        easing: 'easeInOut' as const,
      },
      {
        id: 'z2',
        clipId: 'other',
        startMs: 500,
        rampInMs: 400,
        holdMs: 1000,
        rampOutMs: 400,
        focus: { x: 0.5, y: 0.5 },
        scale: 2,
        easing: 'easeInOut' as const,
      },
    ];

    const shifted = shiftZoomsForTile(zooms, 'clip-long', 60_000);
    expect(shifted[0]?.startMs).toBe(10_000);
    expect(shifted[1]?.startMs).toBe(500);
  });
});

describe('a tiled plan', () => {
  const plan = planFor(200_000);

  it('encodes the tiles in the pool and assembles them for the join', () => {
    const labels = plan.steps.map(({ label }) => label);
    expect(labels).toEqual([
      'clip 1 (source asset-long)',
      'clip 2 (source asset-long)',
      'clip 3 (source asset-long)',
      'clip 4 (source asset-long)',
      'assemble clip 0 from 4 tiles',
      'join 1 clip (concat)',
    ]);
    expect(plan.steps.map((step) => Boolean(step.serial))).toEqual([
      false,
      false,
      false,
      false,
      true,
      true,
    ]);
  });

  it('hands the join the clip file the assemble writes', () => {
    const assemble = plan.steps[4];
    expect(assemble?.output).toBe('/work/clip-0.mp4');
    expect(plan.listFiles?.[0]?.content).toContain("file '/work/clip-1.mp4'");
    expect(plan.listFile?.content).toBe("file '/work/clip-0.mp4'\n");
  });

  it('rebuilds the audio through the concat filter, not the demuxer', () => {
    const args = plan.steps[4]?.args.join(' ') ?? '';
    expect(args).toContain('concat=n=4:v=0:a=1');
    expect(args).toContain('-copyts');
    expect(args).toContain('-c:v copy');
  });

  it('weighs every step for the progress bar', () => {
    expect(plan.steps.every((step) => (step.weightMs ?? 0) > 0)).toBe(true);
  });

  it('lands a banner only on the tile it plays over', () => {
    const withBanner = planFor(200_000, {
      banners: [
        {
          id: 'banner-1',
          startMs: 70_000,
          durationMs: 5_000,
          preset: 'lowerThird',
          text: 'Second minute',
          position: 'bottom',
          animation: 'fade',
        },
      ],
    });
    const carries = withBanner.steps
      .slice(0, 4)
      .map((step) => step.args.join(' ').includes('banner-0.png'));
    expect(carries).toEqual([false, true, false, false]);
  });

  it('never tiles below the threshold', () => {
    expect(planFor(tileTargetMs).steps.map(({ label }) => label)).toEqual([
      'clip 0 (source asset-long)',
      'join 1 clip (concat)',
    ]);
  });
});
