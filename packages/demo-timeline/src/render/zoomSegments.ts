import { Canvas, Zoom } from '../schema';
import { zoomDurationMs } from '../zoom';

// A zoom is a ramp in, a hold and a ramp out, and only the ramps actually
// move the window. This reads a clip's zooms as a run of quiet, still and
// moving stretches, so the tiling can give each stretch the cheapest chain
// that is exact there: a held window is cut out of the source first and
// scaled up once (a quarter of the work at 2x), and a quiet stretch carries
// no zoom arithmetic at all.

export type ZoomSpanKind = 'quiet' | 'still' | 'moving';

// the held window: the magnification and the crop origin as a fraction of
// the frame, exactly the numbers the moving expressions would compute there
export type StillWindow = { scale: number; cropX: number; cropY: number };

export type ZoomSpan = {
  startMs: number;
  endMs: number;
  kind: ZoomSpanKind;
  // only for a still span
  window?: StillWindow;
};

// a sliver is not worth its own branch; the moving chain is correct at every
// instant, so a short span is simply left on it
export const minZoomSpanMs = 200;

// the same numbers the expressions carry: the strings round the constants, so
// the held window is computed from the rounded values too, or the still frame
// would sit a fraction of a pixel away from the moving frame beside it
const roundedGain = (zoom: Zoom): number => Number((zoom.scale - 1).toFixed(3));
const roundedFocus = (value: number): number => Number(value.toFixed(4));

const eased = (zoom: Zoom, ramp: number): number =>
  zoom.easing === 'linear'
    ? ramp
    : ramp < 0.5
      ? 2 * ramp * ramp
      : 1 - 2 * (1 - ramp) * (1 - ramp);

const progressAt = (zoom: Zoom, tMs: number): number => {
  const holdStartMs = zoom.startMs + zoom.rampInMs;
  const holdEndMs = holdStartMs + zoom.holdMs;
  const endMs = holdEndMs + zoom.rampOutMs;
  if (tMs < zoom.startMs || tMs >= endMs) {
    return 0;
  }
  if (tMs < holdStartMs) {
    return zoom.rampInMs === 0
      ? 1
      : eased(zoom, (tMs - zoom.startMs) / zoom.rampInMs);
  }
  if (tMs < holdEndMs) {
    return 1;
  }
  return zoom.rampOutMs === 0
    ? 0
    : 1 - eased(zoom, (tMs - holdEndMs) / zoom.rampOutMs);
};

const clamp = (value: number, low: number, high: number): number =>
  Math.min(high, Math.max(low, value));

// the window at one instant, mirroring zoomExpressions term for term
const windowAt = (zooms: Zoom[], tMs: number): StillWindow => {
  const gains = zooms.map((zoom) => roundedGain(zoom) * progressAt(zoom, tMs));
  const scale = 1 + gains.reduce((total, each) => total + each, 0);
  const crop = (focus: (zoom: Zoom) => number): number =>
    clamp(
      zooms.reduce(
        (total, zoom, at) =>
          total + roundedFocus(focus(zoom)) * (1 - 1 / (1 + (gains[at] ?? 0))),
        0,
      ),
      0,
      1 - 1 / scale,
    );
  return {
    scale,
    cropX: crop((zoom) => zoom.focus.x),
    cropY: crop((zoom) => zoom.focus.y),
  };
};

export const sameWindow = (a?: StillWindow, b?: StillWindow): boolean =>
  a !== undefined &&
  b !== undefined &&
  a.scale === b.scale &&
  a.cropX === b.cropX &&
  a.cropY === b.cropY;

const phaseIn = (zoom: Zoom, fromMs: number, toMs: number): ZoomSpanKind => {
  const holdStartMs = zoom.startMs + zoom.rampInMs;
  const holdEndMs = holdStartMs + zoom.holdMs;
  const endMs = holdEndMs + zoom.rampOutMs;
  if (toMs <= zoom.startMs || fromMs >= endMs) {
    return 'quiet';
  }
  if (fromMs >= holdStartMs && toMs <= holdEndMs) {
    return 'still';
  }
  return 'moving';
};

export const zoomSpans = (zooms: Zoom[], durationMs: number): ZoomSpan[] => {
  const edges = [
    0,
    durationMs,
    ...zooms.flatMap((zoom) => {
      const holdStartMs = zoom.startMs + zoom.rampInMs;
      return [
        zoom.startMs,
        holdStartMs,
        holdStartMs + zoom.holdMs,
        zoom.startMs + zoomDurationMs(zoom),
      ];
    }),
  ]
    .map((edge) => clamp(edge, 0, durationMs))
    .sort((a, b) => a - b)
    .filter((edge, at, all) => at === 0 || edge > (all[at - 1] ?? 0));

  const classified: ZoomSpan[] = [];
  for (let at = 0; at < edges.length - 1; at += 1) {
    const startMs = edges[at] ?? 0;
    const endMs = edges[at + 1] ?? 0;
    const phases = zooms.map((zoom) => phaseIn(zoom, startMs, endMs));
    const kind: ZoomSpanKind =
      endMs - startMs < minZoomSpanMs || phases.includes('moving')
        ? 'moving'
        : phases.includes('still')
          ? 'still'
          : 'quiet';
    // the window is read here, while the stretch still speaks for one set of
    // holds: a zoom with no ramp at all begins and ends mid stretch, so two
    // held stretches can touch with different windows either side
    classified.push({
      startMs,
      endMs,
      kind,
      ...(kind === 'still'
        ? { window: windowAt(zooms, (startMs + endMs) / 2) }
        : {}),
    });
  }

  // neighbours of one kind read as one stretch, and two held ones only when
  // they hold the very same window
  return classified.reduce<ZoomSpan[]>((spans, span) => {
    const last = spans[spans.length - 1];
    if (
      last &&
      last.kind === span.kind &&
      (span.kind !== 'still' || sameWindow(last.window, span.window))
    ) {
      last.endMs = span.endMs;
      return spans;
    }
    return [...spans, { ...span }];
  }, []);
};

const frac = (value: number): string => value.toFixed(6);

// the even floor the moving chain applies to its magnified frame, so the two
// paths show exactly the same share of the source either side of a seam
const shownShare = (size: number, scale: number): number =>
  size / (2 * Math.floor((size * scale) / 2));

// the held window cut straight out of the source and scaled up once: the
// same share of the frame the moving chain would show, without magnifying
// the whole frame first. Fractions of in_w keep one expression right whether
// the input is the canvas or a larger capture the zoom crops directly.
export const stillFilters = (window: StillWindow, canvas: Canvas): string[] => [
  `crop=w='2*floor(in_w*${frac(
    shownShare(canvas.width, window.scale),
  )}/2)':h='2*floor(in_h*${frac(
    shownShare(canvas.height, window.scale),
  )}/2)':x='in_w*${frac(window.cropX)}':y='in_h*${frac(window.cropY)}'`,
  `scale=${canvas.width}:${canvas.height}:flags=lanczos:out_color_matrix=bt709`,
];
