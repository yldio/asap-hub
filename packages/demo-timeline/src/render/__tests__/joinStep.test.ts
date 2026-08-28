import { layoutClips } from '../../clips';
import { Clip, SourceClip } from '../../schema';
import {
  concatListContent,
  hasVisualTransition,
  joinBoundaries,
} from '../joinStep';

const source = (overrides: Partial<SourceClip> = {}): SourceClip => ({
  kind: 'source',
  id: 'clip-1',
  assetId: 'asset-1',
  inMs: 0,
  outMs: 10000,
  volume: 1,
  ...overrides,
});

describe('hasVisualTransition', () => {
  it('is false when every boundary is a cut', () => {
    expect(
      hasVisualTransition(
        layoutClips([source({ id: 'a' }), source({ id: 'b' })]),
      ),
    ).toBe(false);
  });

  it('is false when a crossfade has no duration', () => {
    expect(
      hasVisualTransition(
        layoutClips([
          source({ id: 'a' }),
          source({
            id: 'b',
            transitionIn: { type: 'crossfade', durationMs: 0 },
          }),
        ]),
      ),
    ).toBe(false);
  });

  it('is true as soon as one boundary blends', () => {
    expect(
      hasVisualTransition(
        layoutClips([
          source({ id: 'a' }),
          source({
            id: 'b',
            transitionIn: { type: 'crossfade', durationMs: 500 },
          }),
        ]),
      ),
    ).toBe(true);
  });
});

describe('joinBoundaries', () => {
  it('has no boundary for a single clip', () => {
    expect(joinBoundaries(layoutClips([source()]))).toEqual([]);
  });

  it('offsets each xfade at the incoming clip start, which is where the chain so far ends', () => {
    const clips: Clip[] = [
      source({ id: 'a', outMs: 4000 }),
      source({
        id: 'b',
        outMs: 6000,
        transitionIn: { type: 'crossfade', durationMs: 1000 },
      }),
      source({
        id: 'c',
        outMs: 5000,
        transitionIn: { type: 'slide', durationMs: 500 },
      }),
    ];

    expect(joinBoundaries(layoutClips(clips))).toEqual([
      { index: 1, offsetMs: 3000, durationMs: 1000, transition: 'fade' },
      { index: 2, offsetMs: 8500, durationMs: 500, transition: 'slideleft' },
    ]);
  });

  it('clamps the overlap to half of the shortest neighbour', () => {
    const clips: Clip[] = [
      source({ id: 'a', outMs: 4000 }),
      source({
        id: 'b',
        outMs: 600,
        transitionIn: { type: 'crossfade', durationMs: 2000 },
      }),
    ];

    expect(joinBoundaries(layoutClips(clips))).toEqual([
      { index: 1, offsetMs: 3700, durationMs: 300, transition: 'fade' },
    ]);
  });

  it('reports no duration for a cut between blended clips', () => {
    const clips: Clip[] = [
      source({ id: 'a', outMs: 4000 }),
      source({ id: 'b', outMs: 4000 }),
      source({
        id: 'c',
        outMs: 4000,
        transitionIn: { type: 'crossfade', durationMs: 800 },
      }),
    ];

    expect(joinBoundaries(layoutClips(clips)).map((b) => b.durationMs)).toEqual(
      [0, 800],
    );
  });
});

describe('concatListContent', () => {
  it('writes one line per clip', () => {
    expect(concatListContent(['/work/clip-0.mp4', '/work/clip-1.mp4'])).toBe(
      "file '/work/clip-0.mp4'\nfile '/work/clip-1.mp4'\n",
    );
  });

  it('escapes a quote in a path', () => {
    expect(concatListContent(["/work/o'brien.mp4"])).toBe(
      "file '/work/o'\\''brien.mp4'\n",
    );
  });
});
