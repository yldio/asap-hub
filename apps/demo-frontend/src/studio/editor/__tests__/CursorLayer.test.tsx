import { render } from '@testing-library/react';
import { CursorEffect, defaultCursorColor } from '@asap-hub/demo-timeline';
import CursorLayer, { rippleMs } from '../CursorLayer';

const ripple: CursorEffect = {
  id: 'effect-1',
  tMs: 1000,
  type: 'ripple',
  point: { x: 0.5, y: 0.5 },
  origin: 'derived',
};

const rippleCount = (tMs: number, offsetMs?: number): number => {
  const { container, unmount } = render(
    <CursorLayer effects={[ripple]} tMs={tMs} offsetMs={offsetMs} />,
  );
  const count = container.querySelectorAll('span').length;
  unmount();
  return count;
};

describe('the cursor layer', () => {
  it('shows a click for as long as the render burns it in', () => {
    expect(rippleCount(1000)).toBe(1);
    expect(rippleCount(1000 + rippleMs)).toBe(1);
    expect(rippleCount(1000 + rippleMs + 1)).toBe(0);
  });

  // the nudge is the whole point of the layer's offset, and the render already
  // applies it, so a capture lined up by hand used to drift only in the preview
  it('moves every click by the layer offset, the way the render does', () => {
    expect(rippleCount(1000, 500)).toBe(0);
    expect(rippleCount(1500, 500)).toBe(1);
  });

  it('shifts a click earlier when the offset is negative', () => {
    expect(rippleCount(600, -400)).toBe(1);
    expect(rippleCount(1000 + rippleMs, -400)).toBe(0);
  });
});

describe('a click the creator is parked on', () => {
  // the ring is a wall clock animation ending on opacity 0, so while paused it
  // used to flash once and vanish: exactly when the creator is looking at it
  const hasRipple = (playing: boolean) => {
    const { container, unmount } = render(
      <CursorLayer effects={[ripple]} tMs={1000} playing={playing} />,
    );
    const found = container.querySelector('[data-testid="cursor-ripple"]');
    unmount();
    return Boolean(found);
  };

  it('holds the ring on screen whether the demo is playing or not', () => {
    expect(hasRipple(false)).toBe(true);
    expect(hasRipple(true)).toBe(true);
  });
});

describe('the colour of a click', () => {
  const ringOf = (color?: string) => {
    const { container, unmount } = render(
      <CursorLayer effects={[{ ...ripple, color }]} tMs={1000} />,
    );
    const found = container.querySelector<HTMLElement>(
      '[data-testid="cursor-ripple"]',
    );
    const border = found?.style.borderColor ?? '';
    const shadow = found?.style.boxShadow ?? '';
    unmount();
    return { border, shadow };
  };

  it('draws the ring in the colour the creator picked', () => {
    expect(ringOf('#ff3b30').border).toBe('#ff3b30');
  });

  it('falls back to the default for a click saved before the picker', () => {
    expect(ringOf().border).toBe(defaultCursorColor);
  });

  // a white ring on a white page is invisible without it
  it('always carries a dark edge, whatever the colour', () => {
    expect(ringOf('#ffffff').shadow).toContain('rgba(0, 0, 0');
  });
});
