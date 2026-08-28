import { CursorEffect, CursorPathPoint, limits, Point } from '../schema';
import { toFramePoint } from './geometry';
import { resamplePath } from './path';
import {
  CaptureEvent,
  CaptureEventType,
  DeriveOptions,
  DerivedCursor,
} from './types';

export const defaultDedupeWindowMs = 250;

type PlacedEvent = {
  event: CaptureEvent;
  tMs: number;
  point: Point;
};

// the events that say where the pointer actually was; a scroll or a resize
// carries the last known position and would flatten the path
const pathEventTypes: readonly CaptureEventType[] = ['move', 'down', 'click'];

// the document caps an id at 64 characters
const effectId = (type: CursorEffect['type'], eventId: string): string =>
  `${type}-${eventId}`.slice(0, 64);

const place = (
  events: CaptureEvent[],
  options: DeriveOptions,
): PlacedEvent[] => {
  const offsetMs = options.offsetMs ?? 0;
  return events
    .flatMap((event) => {
      // wall clock to clip-local: anything before the take started, or past the
      // longest timeline the document allows, cannot be represented
      const tMs = Math.round(event.t - options.startedAtEpochMs + offsetMs);
      if (tMs < 0 || tMs > limits.maxTimelineMs) {
        return [];
      }
      const point = toFramePoint(
        event.x,
        event.y,
        { width: event.viewportW, height: event.viewportH },
        options.frame,
      );
      return point ? [{ event, tMs, point }] : [];
    })
    .sort((a, b) => a.tMs - b.tMs);
};

const spacedOut = (
  placed: PlacedEvent[],
  gapMs: number,
  sameSubject: (previous: PlacedEvent, current: PlacedEvent) => boolean,
): PlacedEvent[] => {
  const kept: PlacedEvent[] = [];
  placed.forEach((current) => {
    const previous = kept[kept.length - 1];
    if (
      previous &&
      (sameSubject(previous, current) || current.tMs - previous.tMs < gapMs)
    ) {
      return;
    }
    kept.push(current);
  });
  return kept;
};

const toEffect = (
  type: CursorEffect['type'],
  placed: PlacedEvent,
  tMs: number = placed.tMs,
): CursorEffect => ({
  id: effectId(type, placed.event.id),
  tMs,
  type,
  point: placed.point,
  origin: 'derived',
  sourceEventId: placed.event.id,
});

const autoZoomEffects = (
  clicks: PlacedEvent[],
  options: DeriveOptions,
): CursorEffect[] => {
  const { autoZoom } = options;
  // a zoom to 1 is a no-op, and the effect record carries no scale of its own:
  // the editor applies the configured scale when it materialises the zoom
  if (!autoZoom || !autoZoom.enabled || autoZoom.scale <= 1) {
    return [];
  }

  // a zoom may not start before the previous one has finished holding, or the
  // render stutters through a burst of clicks on the same control
  const gapMs = Math.max(autoZoom.minGapMs, autoZoom.holdMs);
  const effects: CursorEffect[] = [];
  let previousTMs = -Infinity;

  clicks.forEach((click) => {
    const tMs = Math.max(0, click.tMs - autoZoom.leadMs);
    if (tMs - previousTMs < gapMs) {
      return;
    }
    previousTMs = tMs;
    effects.push(toEffect('zoom', click, tMs));
  });

  return effects;
};

export const deriveCursorEffects = (
  events: CaptureEvent[],
  options: DeriveOptions,
): DerivedCursor => {
  const placed = place(events, options);
  const dedupeWindowMs = options.dedupeWindowMs ?? defaultDedupeWindowMs;

  const path: CursorPathPoint[] = resamplePath(
    placed
      .filter(({ event }) => pathEventTypes.includes(event.type))
      .map(({ tMs, point }) => ({ tMs, x: point.x, y: point.y })),
    limits.cursorPathPoints,
  );

  const clicks = spacedOut(
    placed.filter(({ event }) => event.type === 'click'),
    dedupeWindowMs,
    () => false,
  );

  // a hover spotlight repeats while the pointer wanders inside one element, so
  // the same target in a row is collapsed as well as a rapid repeat
  const hovers = spacedOut(
    placed.filter(({ event }) => event.type === 'over'),
    dedupeWindowMs,
    (previous, current) =>
      previous.event.target !== undefined &&
      previous.event.target === current.event.target,
  );

  // ripples are what a viewer expects from a click; the rest are opt-in
  const ripples =
    options.ripples === false
      ? []
      : clicks.map((click) => toEffect('ripple', click));
  const spotlights = options.spotlight
    ? hovers.map((hover) => toEffect('spotlight', hover))
    : [];

  const effects = [
    ...ripples,
    ...spotlights,
    ...autoZoomEffects(clicks, options),
  ]
    .sort((a, b) => a.tMs - b.tMs)
    .slice(0, limits.cursorEffects);

  return { path, effects };
};
