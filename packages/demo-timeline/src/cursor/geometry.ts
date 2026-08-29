import { CaptureSurface, Point } from '../schema';
import { CaptureGeometry } from './types';

const clampUnit = (value: number): number => Math.min(1, Math.max(0, value));

// four decimals is about a fifth of a pixel on a 4K frame, and keeps a long
// path from dominating the timeline document
export const quantise = (value: number): number =>
  Math.round(clampUnit(value) * 10000) / 10000;

export type Frame = { width: number; height: number };

type Rect = { x: number; y: number; width: number; height: number };

// what one captured event was pointing at: the rectangle the recording shows,
// and the pointer, both in the same CSS pixels
export type SharedView = { rect: Rect; at: Point };

// what a mapping needs off an event: the pointer in the page and on the screen,
// and the boxes those two are measured against
export type CapturePlacement = CaptureGeometry & {
  x: number;
  y: number;
  viewportW: number;
  viewportH: number;
};

const positive = (value: number | undefined): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

const finite = (value: number | undefined): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0;

// A tab share shows the page and nothing else, so the page's own coordinates
// are already the whole picture.
const tabView = (event: CapturePlacement): SharedView | undefined =>
  positive(event.viewportW) && positive(event.viewportH)
    ? {
        rect: { x: 0, y: 0, width: event.viewportW, height: event.viewportH },
        at: { x: event.x, y: event.y },
      }
    : undefined;

// Where the recorded display starts on the virtual desktop that screenX counts
// from. The browser will not say: availLeft and availTop are the corner of the
// display's WORK AREA, which a macOS menu bar, a Linux top bar or a Windows
// taskbar insets by tens of pixels, and the recording holds the whole display
// rather than the work area. So an axis is read from the desktop origin whenever
// the pointer already falls on the primary display, which is every single
// monitor take and every display aligned with the primary one, and from the work
// area only when the pointer is somewhere no primary display reaches.
const displayOrigin = (at: number, size: number, workArea: number): number =>
  at >= 0 && at < size ? 0 : workArea;

// A whole screen share shows one display, so the pointer is placed on that
// display. Both the display and the pointer are recorded per event, so a window
// dragged to another monitor mid take keeps mapping correctly from the moment
// it moved.
const monitorView = (event: CapturePlacement): SharedView | undefined => {
  if (!positive(event.screenW) || !positive(event.screenH)) {
    return undefined;
  }
  const at = { x: finite(event.screenX), y: finite(event.screenY) };
  return {
    rect: {
      x: displayOrigin(at.x, event.screenW, finite(event.screenLeft)),
      y: displayOrigin(at.y, event.screenH, finite(event.screenTop)),
      width: event.screenW,
      height: event.screenH,
    },
    at,
  };
};

// A window share shows the browser window, chrome and all, and the window's own
// corner on the desktop is what the pointer is measured from. Recorded per
// event, so moving or resizing the window mid take is followed.
const windowView = (event: CapturePlacement): SharedView | undefined =>
  positive(event.winW) && positive(event.winH)
    ? {
        rect: {
          x: finite(event.winX),
          y: finite(event.winY),
          width: event.winW,
          height: event.winH,
        },
        at: { x: finite(event.screenX), y: finite(event.screenY) },
      }
    : undefined;

const views: Record<
  CaptureSurface,
  (event: CapturePlacement) => SharedView | undefined
> = {
  browser: tabView,
  monitor: monitorView,
  window: windowView,
};

// The rectangle the recording shows and where the pointer sat inside it. A
// stream captured before the snippet reported the screen carries none of the
// numbers the other two mappings need, so it falls back to the page, which is
// the mapping it was recorded under.
export const sharedView = (
  event: CapturePlacement,
  surface: CaptureSurface = 'browser',
): SharedView | undefined => views[surface](event) ?? tabView(event);

// The share of the recorded rectangle the pointer stands at. This is where the
// scale independence lives: both numbers are CSS pixels of one coordinate
// space, so a Retina Mac reporting a 1512 wide screen and a 1920 wide Linux
// screen give the same ratio for the same place, whatever the video's own
// resolution, the device pixel ratio or the browser's zoom.
export const viewRatio = ({ rect, at }: SharedView): Point => ({
  x: clampUnit((at.x - rect.x) / rect.width),
  y: clampUnit((at.y - rect.y) / rect.height),
});

// The renderer fits the recording inside the frame rather than stretching it,
// so a ratio has to be fitted the same way or every effect drifts towards the
// letterbox. The recording is a picture of the shared rectangle, so that
// rectangle's shape is the one being fitted.
export const fitToFrame = (
  ratio: Point,
  source: Frame,
  frame: Frame,
): Point | undefined => {
  if (
    source.width <= 0 ||
    source.height <= 0 ||
    frame.width <= 0 ||
    frame.height <= 0
  ) {
    return undefined;
  }

  const scale = Math.min(
    frame.width / source.width,
    frame.height / source.height,
  );
  const drawnWidth = (source.width * scale) / frame.width;
  const drawnHeight = (source.height * scale) / frame.height;

  return {
    x: quantise((1 - drawnWidth) / 2 + clampUnit(ratio.x) * drawnWidth),
    y: quantise((1 - drawnHeight) / 2 + clampUnit(ratio.y) * drawnHeight),
  };
};

// Where a captured event lands on the rendered frame: read the pointer against
// whatever the creator actually shared, as a ratio, then fit that ratio into
// the frame the way the renderer fits the picture.
export const toFramePoint = (
  event: CapturePlacement,
  frame: Frame,
  surface: CaptureSurface = 'browser',
): Point | undefined => {
  const view = sharedView(event, surface);
  return view ? fitToFrame(viewRatio(view), view.rect, frame) : undefined;
};
