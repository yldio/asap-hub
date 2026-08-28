import { Point, Zoom } from '@asap-hub/demo-timeline';

export type ZoomTransform = { scale: number; originX: number; originY: number };

const clamp01 = (value: number): number =>
  Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));

// Dragging the picture is the natural way to aim a zoom, so the focus follows
// the grab: a point of the frame under the pointer stays under it. Scaling
// about the focus puts a source point u at f + s(u - f) on screen, and holding
// that fixed while the pointer moves by d gives f' = f - d / (s - 1).
export const panFocus = (
  focus: Point,
  delta: { dx: number; dy: number },
  box: { width: number; height: number },
  scale: number,
): Point =>
  scale <= 1 || box.width <= 0 || box.height <= 0
    ? focus
    : {
        x: clamp01(focus.x - delta.dx / box.width / (scale - 1)),
        y: clamp01(focus.y - delta.dy / box.height / (scale - 1)),
      };

export const pointInBox = (
  clientX: number,
  clientY: number,
  bounds: { left: number; top: number; width: number; height: number },
): Point =>
  bounds.width <= 0 || bounds.height <= 0
    ? { x: 0.5, y: 0.5 }
    : {
        x: clamp01((clientX - bounds.left) / bounds.width),
        y: clamp01((clientY - bounds.top) / bounds.height),
      };

export const noZoom: ZoomTransform = { scale: 1, originX: 0.5, originY: 0.5 };

const easeInOut = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;

const ease = (zoom: Zoom, t: number): number =>
  zoom.easing === 'linear' ? t : easeInOut(t);

export const zoomDurationMs = (zoom: Zoom): number =>
  zoom.rampInMs + zoom.holdMs + zoom.rampOutMs;

// how far into the zoom we are, from 0 at rest to 1 fully in
const progressAt = (zoom: Zoom, localMs: number): number => {
  const since = localMs - zoom.startMs;
  if (since < 0 || since > zoomDurationMs(zoom)) {
    return 0;
  }
  if (since < zoom.rampInMs) {
    return zoom.rampInMs === 0 ? 1 : ease(zoom, since / zoom.rampInMs);
  }
  if (since < zoom.rampInMs + zoom.holdMs) {
    return 1;
  }
  const out = since - zoom.rampInMs - zoom.holdMs;
  return zoom.rampOutMs === 0 ? 0 : 1 - ease(zoom, out / zoom.rampOutMs);
};

// the strongest zoom wins where two overlap, rather than compounding into a
// scale nobody asked for
export const zoomTransformAt = (
  zooms: Zoom[],
  clipId: string,
  localMs: number,
): ZoomTransform =>
  zooms
    .filter((zoom) => zoom.clipId === clipId)
    .reduce<ZoomTransform>((strongest, zoom) => {
      const progress = progressAt(zoom, localMs);
      const scale = 1 + (zoom.scale - 1) * progress;
      return scale > strongest.scale
        ? { scale, originX: zoom.focus.x, originY: zoom.focus.y }
        : strongest;
    }, noZoom);
