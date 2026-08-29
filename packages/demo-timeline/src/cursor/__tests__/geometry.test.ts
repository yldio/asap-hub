import { CaptureSurface } from '../../schema';
import {
  CapturePlacement,
  toFramePoint,
  viewRatio,
  sharedView,
} from '../geometry';

const frame = { width: 1920, height: 1080 };

// the creator's own first captured event, from a maximised browser on a 1920
// wide screen: the pointer 1129.4 across the page and 680.1 down the screen,
// with 87 pixels of OS bar, tab strip and toolbar above the page
const real: CapturePlacement = {
  x: 1129.4,
  y: 593.1,
  viewportW: 1134,
  viewportH: 943,
  screenX: 1129.4,
  screenY: 680.1,
  screenW: 1920,
  screenH: 1080,
  screenLeft: 0,
  screenTop: 0,
  winX: 0,
  winY: 0,
  winW: 1134,
  winH: 1030,
};

// every fixture below describes a surface the mapping can read, so a view that
// came back undefined is the test itself being wrong
const ratioOf = (event: CapturePlacement, surface: CaptureSurface) => {
  const view = sharedView(event, surface);
  if (!view) {
    throw new Error(`no ${surface} view for this event`);
  }
  return viewRatio(view);
};

const pixels = (
  event: CapturePlacement,
  surface: CaptureSurface,
  into = frame,
) => {
  const point = toFramePoint(event, into, surface);
  return point
    ? { x: point.x * into.width, y: point.y * into.height }
    : undefined;
};

describe('what the recording actually shows', () => {
  // stretching the page across a frame that holds the whole screen threw every
  // effect hundreds of pixels to the right of what it was pointing at
  it('places a whole screen recording by the screen, not the page', () => {
    expect(pixels(real, 'monitor')).toEqual({
      x: expect.closeTo(1129.4, 0),
      y: expect.closeTo(680.1, 0),
    });
  });

  it('is nowhere near the page mapping that used to be used for it', () => {
    const drawn = pixels(real, 'browser');
    expect(drawn?.x).toBeCloseTo(1604, 0);
    expect((drawn?.x ?? 0) - 1129.4).toBeGreaterThan(400);
  });

  it('places a tab recording by the page, because that is all it holds', () => {
    // 1134 by 943 fitted into 16:9 letterboxes down the sides
    expect(pixels(real, 'browser')?.y).toBeCloseTo(593.1 * (1080 / 943), 0);
  });

  it('places a window recording from the window corner', () => {
    const moved = { ...real, winX: 300, winY: 120, winW: 1200, winH: 900 };
    expect(ratioOf(moved, 'window')).toEqual({
      x: (1129.4 - 300) / 1200,
      y: (680.1 - 120) / 900,
    });
  });

  it('follows a window moved or resized part way through a recording', () => {
    const before = { ...real, winX: 0, winY: 0, winW: 1200, winH: 900 };
    const after = { ...before, winX: 600, screenX: (real.screenX ?? 0) + 600 };
    // the same place in the window, wherever the window went
    expect(ratioOf(before, 'window')).toEqual(ratioOf(after, 'window'));
  });
});

describe('working in ratios rather than pixels', () => {
  // both numbers are CSS pixels of one coordinate space, so the display's own
  // resolution and pixel ratio divide straight out
  it('reads a Retina screen exactly as it reads a plain one', () => {
    const retina: CapturePlacement = {
      x: 400,
      y: 300,
      viewportW: 1000,
      viewportH: 700,
      screenX: 378,
      screenY: 245.5,
      screenW: 1512,
      screenH: 982,
      screenLeft: 0,
      screenTop: 0,
    };
    const plain: CapturePlacement = {
      ...retina,
      screenX: 480,
      screenY: 270,
      screenW: 1920,
      screenH: 1080,
    };

    expect(ratioOf(retina, 'monitor')).toEqual({
      x: 0.25,
      y: 0.25,
    });
    expect(ratioOf(plain, 'monitor')).toEqual(ratioOf(retina, 'monitor'));
  });

  it('draws the same place whatever the frame it is rendered into', () => {
    const into = { width: 3840, height: 2160 };
    const small = toFramePoint(real, frame, 'monitor');
    const large = toFramePoint(real, into, 'monitor');
    expect(large).toEqual(small);
  });
});

describe('more than one monitor', () => {
  const onTheLeft: CapturePlacement = {
    x: 100,
    y: 100,
    viewportW: 1200,
    viewportH: 800,
    // the desktop counts from the primary display's corner, so a display to the
    // left of it is at negative coordinates
    screenX: -960,
    screenY: 540,
    screenW: 1920,
    screenH: 1080,
    screenLeft: -1920,
    screenTop: 0,
  };

  it('reads a negative screenX against the display it belongs to', () => {
    expect(ratioOf(onTheLeft, 'monitor')).toEqual({
      x: 0.5,
      y: 0.5,
    });
  });

  it('reads a display placed past the primary one the same way', () => {
    const onTheRight = {
      ...onTheLeft,
      screenX: 1920 + 480,
      screenLeft: 1920,
    };
    expect(ratioOf(onTheRight, 'monitor').x).toBe(0.25);
  });

  // availTop is the corner of the WORK AREA, so on a Mac it is a menu bar down
  // from the corner of the display the recording actually holds
  it('ignores a work area inset when the pointer is on the primary display', () => {
    const macBook: CapturePlacement = {
      x: 400,
      y: 300,
      viewportW: 1200,
      viewportH: 700,
      screenX: 756,
      screenY: 491,
      screenW: 1512,
      screenH: 982,
      screenLeft: 0,
      // the menu bar, which the recording of the whole screen still shows
      screenTop: 25,
    };

    expect(ratioOf(macBook, 'monitor')).toEqual({ x: 0.5, y: 0.5 });
  });

  it('pins to the edge rather than off the frame when the origin is unknown', () => {
    const noOrigin = { ...onTheLeft, screenLeft: undefined };
    expect(ratioOf(noOrigin, 'monitor').x).toBe(0);
  });
});

describe('a stream captured before the snippet reported the screen', () => {
  const old: CapturePlacement = {
    x: 500,
    y: 400,
    viewportW: 1000,
    viewportH: 800,
  };

  it.each(['browser', 'window', 'monitor'] as const)(
    'falls back to the page it was derived under, asked for %s',
    (surface) => {
      expect(toFramePoint(old, frame, surface)).toEqual(
        toFramePoint(old, frame, 'browser'),
      );
    },
  );

  it('reads a capture with no surface at all as a tab', () => {
    expect(toFramePoint(real, frame)).toEqual(
      toFramePoint(real, frame, 'browser'),
    );
  });
});

describe('the letterbox', () => {
  it('fits the recorded rectangle rather than stretching it', () => {
    const tall: CapturePlacement = {
      x: 0,
      y: 0,
      viewportW: 1000,
      viewportH: 1000,
      screenX: 0,
      screenY: 0,
      screenW: 1000,
      screenH: 1000,
    };
    // a square screen in a 16:9 frame leaves a bar each side
    expect(toFramePoint(tall, frame, 'monitor')?.x).toBeCloseTo(0.2188, 3);
    expect(toFramePoint(tall, frame, 'monitor')?.y).toBe(0);
  });

  it('refuses a frame or a surface with no size', () => {
    expect(
      toFramePoint(real, { width: 0, height: 0 }, 'monitor'),
    ).toBeUndefined();
    expect(
      toFramePoint({ ...real, viewportW: 0, viewportH: 0 }, frame, 'browser'),
    ).toBeUndefined();
  });
});
