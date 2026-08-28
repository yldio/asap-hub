import { layoutClips } from '../../clips';
import { Canvas, SourceClip, TitleClip } from '../../schema';
import {
  chain,
  clipAudioFilters,
  clipHasAudio,
  filterSegment,
  fitToCanvasFilters,
  graph,
  overlayFilter,
  overlayInputFilters,
  secondsFromMs,
  videoFilters,
  xfadeTransition,
} from '../filters';

const canvas: Canvas = { width: 1920, height: 1080, fps: 30 };

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

describe('secondsFromMs', () => {
  it.each([
    [0, '0.000'],
    [1500, '1.500'],
    [333, '0.333'],
    [60000, '60.000'],
  ])('renders %sms as %s', (ms, expected) => {
    expect(secondsFromMs(ms)).toBe(expected);
  });
});

describe('filterSegment', () => {
  it('joins labelled inputs, a filter chain and an output label', () => {
    expect(filterSegment(['0:v', '1:v'], ['overlay=0:0'], 'v1')).toBe(
      '[0:v][1:v]overlay=0:0[v1]',
    );
  });

  it('separates segments with a semicolon', () => {
    expect(graph(['a', 'b'])).toBe('a;b');
  });

  it('separates filters with a comma', () => {
    expect(chain(['a', 'b'])).toBe('a,b');
  });
});

describe('fitToCanvasFilters', () => {
  it('letterboxes the source into the canvas without stretching it', () => {
    expect(fitToCanvasFilters(canvas)).toEqual([
      'scale=1920:1080:force_original_aspect_ratio=decrease:flags=lanczos',
      'pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black',
      'setsar=1',
    ]);
  });
});

describe('videoFilters', () => {
  it('fits a source clip to the canvas', () => {
    const [placement] = layoutClips([source()]);

    expect(placement && videoFilters({ canvas, placement })).toEqual(
      fitToCanvasFilters(canvas),
    );
  });

  it('leaves a generated title background at its own size', () => {
    const [placement] = layoutClips([title()]);

    expect(placement && videoFilters({ canvas, placement })).toEqual([
      'setsar=1',
    ]);
  });
});

describe('clipHasAudio', () => {
  it('is false for a muted clip', () => {
    expect(clipHasAudio(source({ volume: 0 }))).toBe(false);
  });

  it('is true for an audible clip', () => {
    expect(clipHasAudio(source({ volume: 0.5 }))).toBe(true);
  });

  it('is true for a title card, which carries generated silence', () => {
    expect(clipHasAudio(title())).toBe(true);
  });
});

describe('clipAudioFilters', () => {
  it('only resamples at full volume', () => {
    expect(clipAudioFilters(source())).toEqual([
      'aresample=async=1:first_pts=0',
    ]);
  });

  it('adds a volume filter for any other level', () => {
    expect(clipAudioFilters(source({ volume: 0.4 }))).toEqual([
      'volume=0.4',
      'aresample=async=1:first_pts=0',
    ]);
  });
});

describe('overlay filters', () => {
  it('fades a timed overlay in and out over 300ms', () => {
    expect(overlayInputFilters({ startMs: 2000, endMs: 7000 })).toEqual([
      'format=rgba',
      'fade=t=in:st=2.000:d=0.300:alpha=1',
      'fade=t=out:st=6.700:d=0.300:alpha=1',
    ]);
  });

  it('never fades for longer than half of a short overlay', () => {
    expect(overlayInputFilters({ startMs: 0, endMs: 400 })).toEqual([
      'format=rgba',
      'fade=t=in:st=0.000:d=0.200:alpha=1',
      'fade=t=out:st=0.200:d=0.200:alpha=1',
    ]);
  });

  it('does not fade an overlay with no visible window at all', () => {
    expect(overlayInputFilters({ startMs: 5000, endMs: 5000 })).toEqual([
      'format=rgba',
    ]);
  });

  it('does not fade an untimed overlay such as a title card', () => {
    expect(overlayInputFilters()).toEqual(['format=rgba']);
  });

  it('gates a timed overlay in clip local time', () => {
    expect(overlayFilter({ startMs: 2000, endMs: 7000 })).toBe(
      "overlay=0:0:enable='between(t,2.000,7.000)'",
    );
  });

  it('composites an untimed overlay at the origin', () => {
    expect(overlayFilter()).toBe('overlay=0:0');
  });
});

describe('xfadeTransition', () => {
  it('maps a crossfade to fade', () => {
    expect(xfadeTransition({ type: 'crossfade', durationMs: 500 })).toBe(
      'fade',
    );
  });

  it('maps a slide to slideleft', () => {
    expect(xfadeTransition({ type: 'slide', durationMs: 500 })).toBe(
      'slideleft',
    );
  });
});
