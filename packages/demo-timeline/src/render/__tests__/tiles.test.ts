import { layoutClips } from '../../clips';
import { SourceClip, Timeline } from '../../schema';
import { createEmptyTimeline } from '../../document';
import { buildRenderPlan } from '../plan';
import {
  shiftZoomsForTile,
  tilePlacements,
  tileSpans,
  tileTargetMs,
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
  it('cuts a boundary at each zoom edge, so quiet stretches stand alone', () => {
    expect(tileSpans(120_000, [{ startMs: 30_000, endMs: 50_000 }])).toEqual([
      { startMs: 0, endMs: 30_000 },
      { startMs: 30_000, endMs: 50_000 },
      { startMs: 50_000, endMs: 120_000 },
    ]);
  });

  it('folds a sliver into its neighbour rather than spawning a process for it', () => {
    expect(tileSpans(70_000, [{ startMs: 60_000, endMs: 70_000 }])).toEqual([
      { startMs: 0, endMs: 70_000 },
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

  it('feeds the tiles straight into the join when the timeline is all cuts', () => {
    const labels = plan.steps.map(({ label }) => label);
    expect(labels).toEqual([
      'clip 1 (source asset-long)',
      'clip 2 (source asset-long)',
      'clip 3 (source asset-long)',
      'clip 4 (source asset-long)',
      'join 4 clips (concat)',
    ]);
    expect(plan.listFile?.content).toBe(
      [
        "file '/work/clip-1.mp4'\n",
        "file '/work/clip-2.mp4'\n",
        "file '/work/clip-3.mp4'\n",
        "file '/work/clip-4.mp4'\n",
      ].join(''),
    );
    expect(plan.listFiles).toBeUndefined();
  });

  // a crossfade join blends whole clips, so the tiles come back together as
  // the clip file the xfade chain expects
  it('assembles the tiles per clip when a transition needs whole clips', () => {
    const faded = buildRenderPlan({
      timeline: {
        ...createEmptyTimeline(),
        clips: [
          longClip(200_000),
          {
            kind: 'source',
            id: 'clip-next',
            assetId: 'asset-long',
            inMs: 0,
            outMs: 30_000,
            volume: 1,
            transitionIn: { type: 'crossfade', durationMs: 1000 },
          },
        ],
      },
      assets: longAsset(200_000),
      workDir: '/work',
      output: '/work/out.mp4',
    });

    const assemble = faded.steps.find(({ label }) =>
      label.startsWith('assemble'),
    );
    expect(assemble?.output).toBe('/work/clip-0.mp4');
    expect(assemble?.serial).toBe(true);
    const args = assemble?.args.join(' ') ?? '';
    expect(args).toContain('concat=n=4:v=0:a=1');
    expect(args).toContain('-copyts');
    expect(args).toContain('-c:v copy');
    expect(faded.listFiles?.[0]?.content).toContain("file '/work/clip-2.mp4'");
  });

  it('weighs every step for the progress bar', () => {
    expect(plan.steps.every((step) => (step.weightMs ?? 0) > 0)).toBe(true);
  });

  // a zoom on one minute of a long take used to cost the rescale on all of
  // it; now only the tile the zoom touches carries the chain
  it('keeps the rescale chain off the quiet tiles', () => {
    const zoomed = planFor(200_000, {
      zooms: [
        {
          id: 'z1',
          clipId: 'clip-long',
          startMs: 70_000,
          rampInMs: 400,
          holdMs: 20_000,
          rampOutMs: 400,
          focus: { x: 0.5, y: 0.5 },
          scale: 2,
          easing: 'easeInOut',
        },
      ],
    });
    const clipSteps = zoomed.steps.filter(({ label }) =>
      label.startsWith('clip'),
    );
    const carries = clipSteps.map((step) =>
      step.args.join(' ').includes(',crop=1920:1080:'),
    );
    expect(clipSteps.length).toBeGreaterThan(2);
    expect(carries.filter(Boolean)).toHaveLength(1);
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
