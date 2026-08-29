import {
  cursorPointerTrack,
  maxPointerPoints,
  pointerPositionAt,
} from '../../cursor/pointer';
import { pointerVariant, pointerVariants } from '../../cursor/pointerArt';
import { cursorEdge, defaultCursorColor } from '../../cursorColors';
import { CursorPathPoint } from '../../schema';
import { pointerHotspotPx, pointerMotion, pointerSvg } from '../pointer';

const canvas = { width: 1920, height: 1080 };

const trackOf = (path: CursorPathPoint[], offsetMs = 0) =>
  cursorPointerTrack({ path, offsetMs });

const straight: CursorPathPoint[] = [
  { tMs: 0, x: 0.25, y: 0.5 },
  { tMs: 1000, x: 0.75, y: 0.5 },
];

describe('pointerSvg', () => {
  it.each(pointerVariants.map(({ id }) => id))('draws the %s', (variant) => {
    expect(pointerSvg({ canvas, variant })).toMatchSnapshot();
  });

  it('holds a shape to the same fraction of the frame at any canvas size', () => {
    expect(pointerSvg({ canvas: { width: 3840, height: 2160 } })).toContain(
      'scale(0.13274)',
    );
  });

  it('draws it in the default ink, whatever colour the clicks are', () => {
    expect(pointerSvg({ canvas })).toContain(`fill="${defaultCursorColor}"`);
  });

  // a white pointer on a white page is invisible without it
  it('carries the same dark edge a click ring carries', () => {
    expect(pointerSvg({ canvas })).toContain(`stroke="${cursorEdge}"`);
  });

  it('falls back to the arrow for a variant nobody drew', () => {
    expect(pointerSvg({ canvas, variant: 'unicorn' })).toEqual(
      pointerSvg({ canvas, variant: 'arrow' }),
    );
  });
});

describe('the hotspot', () => {
  // aiming the corner of the sprite leaves the pointer feeling offset from what
  // it is clicking, so each shape is aimed by the part that points
  it.each(pointerVariants.map(({ id }) => id))(
    'lands the pointing part of the %s on the captured position',
    (id) => {
      const variant = pointerVariant(id);
      const hotspot = pointerHotspotPx({ canvas, variant: id });
      const scale = (canvas.height * variant.heightRatio) / variant.height;
      const pad = variant.edgeWidth / 2;
      expect(hotspot).toEqual({
        x: Math.round((variant.hotspot.x + pad) * scale),
        y: Math.round((variant.hotspot.y + pad) * scale),
      });
    },
  );

  it('takes the ring by its centre and the arrow by its tip', () => {
    expect(pointerHotspotPx({ canvas, variant: 'ring' }).x).toBeGreaterThan(
      pointerHotspotPx({ canvas, variant: 'arrow' }).x,
    );
  });
});

describe('pointerMotion', () => {
  it('walks the pointer from one sample to the next', () => {
    expect(
      pointerMotion(trackOf(straight), { canvas }, 10000),
    ).toMatchSnapshot();
  });

  it('aims the tip rather than the corner of the image it is drawn in', () => {
    const hotspot = pointerHotspotPx({ canvas });
    expect(pointerMotion(trackOf(straight), { canvas }, 10000)?.x).toMatch(
      new RegExp(`^${Math.round(0.25 * canvas.width) - hotspot.x}\\+`),
    );
  });

  it('shows the pointer only while the capture covers the clip', () => {
    expect(pointerMotion(trackOf(straight), { canvas }, 10000)).toEqual(
      expect.objectContaining({ startMs: 0, endMs: 1000 }),
    );
  });

  it('stops the pointer where the clip ends, not where the capture does', () => {
    expect(pointerMotion(trackOf(straight), { canvas }, 400)).toEqual(
      expect.objectContaining({ endMs: 400 }),
    );
  });

  it('draws nothing for a clip with no capture', () => {
    expect(pointerMotion(trackOf([]), { canvas }, 10000)).toBeUndefined();
  });

  it('draws nothing for a capture the nudge pushed off the clip', () => {
    expect(
      pointerMotion(trackOf(straight, -5000), { canvas }, 10000),
    ).toBeUndefined();
  });

  // `t--1.500` is not something ffmpeg's parser accepts
  it('adds rather than subtracts a sample nudged before the clip start', () => {
    const early = pointerMotion(trackOf(straight, -400), { canvas }, 10000);
    expect(early?.x).toContain('(t+0.400)');
    expect(early?.x).not.toContain('t--');
  });

  // one branch per sample would nest hundreds deep on a long recording; a sum of
  // clamped ramps is flat, and reproduces the track the preview reads exactly
  it('sums clamped ramps rather than nesting a branch per sample', () => {
    const wiggle = Array.from({ length: 20 }, (_unused, index) => ({
      tMs: index * 100,
      x: index % 2 === 0 ? 0.2 : 0.8,
      y: 0.5,
    }));
    const motion = pointerMotion(trackOf(wiggle), { canvas }, 10000);
    expect(motion?.x).not.toContain('if(');
    expect(motion?.x).toContain('clip(');
  });

  it('keeps the expression bounded however long the recording runs', () => {
    const long = Array.from({ length: 6000 }, (_unused, index) => ({
      tMs: index * 100,
      x: index % 2 === 0 ? 0.1 : 0.9,
      y: index % 3 === 0 ? 0.2 : 0.8,
    }));
    const motion = pointerMotion(trackOf(long), { canvas }, 600000);
    expect(motion?.x.match(/clip\(/g)?.length ?? 0).toBeLessThan(
      maxPointerPoints,
    );
  });
});

/* the preview and the export drawing one path */

const clip = (value: number, low: number, high: number): number =>
  Math.min(high, Math.max(low, value));

// the expression is arithmetic over t and clip, which is a subset of what this
// evaluates, so the render's own filtergraph can be read back and compared
const evaluate = (expression: string, tMs: number): number =>
  Function('t', 'clip', `return ${expression};`)(tMs / 1000, clip) as number;

describe('what ffmpeg is asked to draw', () => {
  // rests and eased bursts, the way a hand actually moves a mouse
  const drawn = Array.from({ length: 120 }, (_unused, index) => {
    const leg = Math.floor(index / 12);
    const ratio = (index % 12) / 12;
    const eased = ratio * ratio * (3 - 2 * ratio);
    return {
      tMs: index * 100,
      x: 0.2 + (leg % 2 === 0 ? eased : 1 - eased) * 0.6,
      y: 0.25 + (leg / 20) * 0.5,
    };
  });

  const track = trackOf(drawn);
  const motion = pointerMotion(track, { canvas }, 12000);
  const hotspot = pointerHotspotPx({ canvas });

  // the two have drifted before, on the banner fades and on the ripple, so the
  // expression is checked against the very track the preview reads
  it('puts the pointer where the preview puts it, frame for frame', () => {
    const worst = Array.from({ length: 400 }, (_unused, index) => {
      const tMs = Math.round((index * 12000) / 400);
      const on = pointerPositionAt(track, tMs);
      if (!on || !motion) {
        return 0;
      }
      return Math.max(
        Math.abs(evaluate(motion.x, tMs) - (on.x * canvas.width - hotspot.x)),
        Math.abs(evaluate(motion.y, tMs) - (on.y * canvas.height - hotspot.y)),
      );
    }).reduce((furthest, gap) => Math.max(furthest, gap), 0);

    // the expression works in whole pixels, so half of one is all that is left
    expect(worst).toBeLessThanOrEqual(0.5);
  });

  it('holds the pointer at the ends of the capture, not past them', () => {
    expect(evaluate(motion?.x ?? '0', 0)).toBeCloseTo(
      (track[0]?.x ?? 0) * canvas.width - hotspot.x,
      0,
    );
  });
});
