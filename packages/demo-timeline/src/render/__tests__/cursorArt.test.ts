import { CursorEffect } from '../../schema';
import {
  cursorArt,
  rippleDurationMs,
  rippleSvg,
  spotlightDurationMs,
  spotlightSvg,
} from '../cursorArt';

const canvas = { width: 1920, height: 1080 };

const effect = (overrides: Partial<CursorEffect> = {}): CursorEffect => ({
  id: 'effect-1',
  tMs: 1000,
  type: 'ripple',
  point: { x: 0.25, y: 0.75 },
  origin: 'manual',
  ...overrides,
});

describe('rippleSvg', () => {
  it('draws a ring on the click point', () => {
    expect(
      rippleSvg({ point: { x: 0.25, y: 0.75 }, canvas }),
    ).toMatchSnapshot();
  });

  it('keeps the ring the same fraction of the frame at any canvas size', () => {
    expect(
      rippleSvg({
        point: { x: 0.5, y: 0.5 },
        canvas: { width: 3840, height: 2160 },
      }),
    ).toContain('r="173"');
  });
});

describe('spotlightSvg', () => {
  it('darkens the frame around the point', () => {
    expect(
      spotlightSvg({ point: { x: 0.25, y: 0.75 }, canvas }),
    ).toMatchSnapshot();
  });

  // the browser measures a radial-gradient's stops against the farthest corner,
  // so the svg gradient has to be given that same radius
  it('reaches the farthest corner from the point', () => {
    expect(spotlightSvg({ point: { x: 0, y: 0 }, canvas })).toContain(
      `r="${Math.round(Math.hypot(1920, 1080))}"`,
    );
  });
});

describe('cursorArt', () => {
  it('decays a ripple over its whole window', () => {
    expect(cursorArt(effect(), canvas)).toEqual(
      expect.objectContaining({
        durationMs: rippleDurationMs,
        fadeInMs: 0,
        fadeOutMs: rippleDurationMs,
      }),
    );
  });

  it('ramps a spotlight in and out', () => {
    expect(cursorArt(effect({ type: 'spotlight' }), canvas)).toEqual(
      expect.objectContaining({
        durationMs: spotlightDurationMs,
        fadeInMs: 200,
      }),
    );
  });

  it('draws nothing for the zoom marker the editor materialises', () => {
    expect(cursorArt(effect({ type: 'zoom' }), canvas)).toBeUndefined();
  });
});
