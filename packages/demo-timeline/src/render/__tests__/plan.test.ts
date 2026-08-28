import { createEmptyTimeline } from '../../document';
import {
  Banner,
  Clip,
  NarrationClip,
  SourceClip,
  Timeline,
  TitleClip,
} from '../../schema';
import { buildRenderPlan, describePlan, renderDurationMs } from '../plan';
import { RenderAsset } from '../types';

const assets: RenderAsset[] = [
  {
    assetId: 'asset-1',
    path: '/media/asset-1.mp4',
    durationMs: 60000,
    width: 1920,
    height: 1080,
    fps: 30,
  },
  { assetId: 'asset-2', path: '/media/asset-2.mp4', durationMs: 60000 },
  {
    assetId: 'silent-1',
    path: '/media/silent-1.mp4',
    durationMs: 60000,
    hasAudio: false,
  },
  { assetId: 'voice-1', path: '/media/voice-1.m4a', durationMs: 20000 },
];

const source = (overrides: Partial<SourceClip> = {}): SourceClip => ({
  kind: 'source',
  id: 'clip-1',
  assetId: 'asset-1',
  inMs: 0,
  outMs: 10000,
  volume: 1,
  ...overrides,
});

const title = (overrides: Partial<TitleClip> = {}): TitleClip => ({
  kind: 'title',
  id: 'title-1',
  durationMs: 3000,
  preset: 'centered',
  text: 'Attendance',
  ...overrides,
});

const banner = (overrides: Partial<Banner> = {}): Banner => ({
  id: 'banner-1',
  startMs: 2000,
  durationMs: 5000,
  preset: 'lowerThird',
  text: 'Rebecca Nunn',
  position: 'bottom',
  animation: 'fade',
  ...overrides,
});

const narrationTake = (
  overrides: Partial<NarrationClip> = {},
): NarrationClip => ({
  id: 'take-1',
  assetId: 'voice-1',
  startMs: 1500,
  inMs: 0,
  outMs: 4000,
  volume: 1,
  ...overrides,
});

const timelineOf = (overrides: Partial<Timeline>): Timeline => ({
  ...createEmptyTimeline(),
  ...overrides,
});

const planFor = (overrides: Partial<Timeline>) =>
  buildRenderPlan({
    timeline: timelineOf(overrides),
    assets,
    workDir: '/work',
    output: '/work/out.mp4',
  });

const crossfaded: Clip[] = [
  source({ id: 'a', outMs: 4000 }),
  source({
    id: 'b',
    assetId: 'asset-2',
    outMs: 6000,
    transitionIn: { type: 'crossfade', durationMs: 1000 },
  }),
];

describe('renderDurationMs', () => {
  it('is zero without clips', () => {
    expect(renderDurationMs(createEmptyTimeline())).toBe(0);
  });

  it('is the clip layout duration, transitions included', () => {
    expect(renderDurationMs(timelineOf({ clips: crossfaded }))).toBe(9000);
  });
});

describe('buildRenderPlan', () => {
  it('plans nothing for an empty timeline', () => {
    const plan = planFor({});

    expect(plan).toEqual({
      canvas: { width: 1920, height: 1080, fps: 30 },
      durationMs: 0,
      steps: [],
      output: '/work/out.mp4',
      svgs: [],
    });
  });

  it('rejects a clip whose asset is missing', () => {
    expect(() => planFor({ clips: [source({ assetId: 'nope' })] })).toThrow(
      'clip clip-1 references unknown asset nope',
    );
  });

  it('rejects a narration take whose asset is missing', () => {
    expect(() =>
      planFor({
        clips: [source()],
        narration: [narrationTake({ assetId: 'nope' })],
      }),
    ).toThrow('narration take-1 references unknown asset nope');
  });

  describe('a single source clip', () => {
    const plan = planFor({ clips: [source({ inMs: 2000, outMs: 12000 })] });

    it('encodes the clip and then joins with the concat demuxer', () => {
      expect(plan.steps).toMatchSnapshot();
    });

    it('writes a concat list for the caller', () => {
      expect(plan.listFile).toEqual({
        path: '/work/concat.txt',
        content: "file '/work/clip-0.mp4'\n",
      });
    });

    it('rasterises nothing', () => {
      expect(plan.svgs).toEqual([]);
    });
  });

  describe('two clips with a crossfade', () => {
    const plan = planFor({ clips: crossfaded });

    it('joins them with an xfade chain', () => {
      expect(plan.steps).toMatchSnapshot();
    });

    it('needs no concat list', () => {
      expect(plan.listFile).toBeUndefined();
    });

    it('takes the xfade offset from the clip layout', () => {
      expect(plan.steps.at(-1)?.args.join(' ')).toContain(
        'xfade=transition=fade:duration=1.000:offset=3.000',
      );
    });
  });

  describe('a clip with a banner', () => {
    const plan = planFor({ clips: [source()], banners: [banner()] });

    it('overlays the rasterised banner for its own window', () => {
      expect(plan.steps).toMatchSnapshot();
    });

    it('hands the caller the banner svg to rasterise', () => {
      expect(plan.svgs.map(({ path }) => path)).toEqual(['/work/banner-0.png']);
      expect(plan.svgs[0]?.svg).toContain('Rebecca Nunn');
    });
  });

  it('leaves a clip the banner does not reach untouched', () => {
    const plan = planFor({
      clips: crossfaded,
      banners: [banner({ startMs: 0, durationMs: 2000 })],
    });

    expect(
      plan.steps
        .slice(0, 2)
        .map((step) => step.args.join(' ').includes('/work/banner-0.png')),
    ).toEqual([true, false]);
  });

  it('carries a banner that spans a transition onto both clips, rasterised once', () => {
    const plan = planFor({
      clips: crossfaded,
      banners: [banner({ startMs: 2000, durationMs: 4000 })],
    });

    expect(plan.svgs).toHaveLength(1);
    expect(
      plan.steps
        .slice(0, 2)
        .map((step) => step.args.join(' ').includes('/work/banner-0.png')),
    ).toEqual([true, true]);
  });

  describe('a title card between two clips', () => {
    const plan = planFor({
      clips: [
        source({ id: 'a', outMs: 4000 }),
        title({ id: 't' }),
        source({ id: 'b', assetId: 'asset-2', outMs: 5000 }),
      ],
    });

    it('generates a background and overlays the card', () => {
      expect(plan.steps).toMatchSnapshot();
    });

    it('hands the caller the title svg to rasterise', () => {
      expect(plan.svgs.map(({ path }) => path)).toEqual(['/work/title-1.png']);
      expect(plan.svgs[0]?.svg).toContain('Attendance');
    });
  });

  describe('a narration take', () => {
    const plan = planFor({
      clips: [source()],
      narration: [narrationTake({ volume: 0.8 })],
    });

    it('mixes the take into the join in programme time', () => {
      expect(plan.steps.at(-1)).toMatchSnapshot();
    });

    it('never lets amix attenuate the programme audio', () => {
      expect(plan.steps.at(-1)?.args.join(' ')).toContain(
        'amix=inputs=2:normalize=0:dropout_transition=0',
      );
    });
  });

  it('mixes narration into an xfade join after the clip inputs', () => {
    const plan = planFor({ clips: crossfaded, narration: [narrationTake()] });

    expect(plan.steps.at(-1)?.args).toMatchSnapshot();
  });

  describe('a banner that slides', () => {
    it('rises into place from the bottom edge', () => {
      expect(
        planFor({
          clips: [source()],
          banners: [banner({ animation: 'slide' })],
        }).steps,
      ).toMatchSnapshot();
    });

    it('drops into place from the top edge', () => {
      const args =
        planFor({
          clips: [source()],
          banners: [banner({ animation: 'slide', position: 'top' })],
        }).steps[0]?.args.join(' ') ?? '';

      expect(args).toContain("y='-281*(1-min(1,max(0,(t-2.000)/0.300))");
    });

    it('leaves a fading banner composited at the origin', () => {
      const args =
        planFor({
          clips: [source()],
          banners: [banner()],
        }).steps[0]?.args.join(' ') ?? '';

      expect(args).toContain("overlay=0:0:enable='between(t,2.000,7.000)'");
      expect(args).not.toContain("y='");
    });
  });

  describe('every clip step carries exactly one audio stream', () => {
    const silentFixtures: [string, Partial<Timeline>][] = [
      ['a muted clip', { clips: [source({ volume: 0 })] }],
      ['an asset with no audio', { clips: [source({ assetId: 'silent-1' })] }],
      ['a title card', { clips: [title()] }],
      [
        'a muted clip joined with a crossfade',
        {
          clips: [
            source({ id: 'a', outMs: 4000, volume: 0 }),
            source({
              id: 'b',
              assetId: 'asset-2',
              outMs: 6000,
              transitionIn: { type: 'crossfade', durationMs: 1000 },
            }),
          ],
        },
      ],
    ];

    it.each(silentFixtures)('never emits -an for %s', (_, overrides) => {
      planFor(overrides).steps.forEach((step) => {
        expect(step.args).not.toContain('-an');
      });
    });

    it.each(silentFixtures)('gives %s generated silence', (_, overrides) => {
      expect(planFor(overrides).steps[0]?.args.join(' ')).toContain(
        '-i anullsrc=channel_layout=stereo:sample_rate=48000',
      );
    });

    it('replaces the source audio of a muted clip with silence', () => {
      expect(
        planFor({ clips: [source({ volume: 0 })] }).steps[0],
      ).toMatchSnapshot();
    });

    it('replaces the source audio of an unprobed silent asset with silence', () => {
      expect(
        planFor({ clips: [source({ assetId: 'silent-1' })] }).steps[0]?.args,
      ).toMatchSnapshot();
    });

    it('keeps the volume filter on a muted clip', () => {
      expect(
        planFor({ clips: [source({ volume: 0 })] }).steps[0]?.args,
      ).toEqual(
        expect.arrayContaining(['volume=0,aresample=async=1:first_pts=0']),
      );
    });

    it('lets the join blend clip audio directly, with no substitute inputs', () => {
      const plan = planFor({
        clips: [
          source({ id: 'a', outMs: 4000, volume: 0 }),
          source({
            id: 'b',
            assetId: 'asset-2',
            outMs: 6000,
            transitionIn: { type: 'crossfade', durationMs: 1000 },
          }),
        ],
      });
      const args = plan.steps.at(-1)?.args.join(' ') ?? '';

      expect(args).toContain('[0:a][1:a]acrossfade=d=1.000');
      expect(args).not.toContain('anullsrc');
    });
  });

  it('joins a cut inside an otherwise blended timeline without a transition', () => {
    const plan = planFor({
      clips: [
        source({ id: 'a', outMs: 4000 }),
        source({ id: 'b', assetId: 'asset-2', outMs: 4000 }),
        source({
          id: 'c',
          outMs: 4000,
          transitionIn: { type: 'crossfade', durationMs: 800 },
        }),
      ],
    });

    const args = plan.steps.at(-1)?.args.join(' ') ?? '';

    expect(args).toContain('[0:v][1:v]concat=n=2:v=1:a=0[v1]');
    expect(args).toContain('[v1][2:v]xfade=transition=fade');
  });
});

describe('describePlan', () => {
  it('writes one line per step for the job log', () => {
    expect(
      describePlan(
        planFor({
          clips: [source({ id: 'a', outMs: 4000 }), title({ id: 't' })],
        }),
      ),
    ).toEqual([
      '1/3 clip 0 (source asset-1) -> /work/clip-0.mp4',
      '2/3 clip 1 (title "Attendance") -> /work/clip-1.mp4',
      '3/3 join 2 clips (concat) -> /work/out.mp4',
    ]);
  });

  it('names a single clip join in the singular', () => {
    expect(describePlan(planFor({ clips: [source()] }))).toEqual([
      '1/2 clip 0 (source asset-1) -> /work/clip-0.mp4',
      '2/2 join 1 clip (concat) -> /work/out.mp4',
    ]);
  });
});
