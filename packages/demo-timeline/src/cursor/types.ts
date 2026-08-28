import { CursorEffect, CursorPathPoint } from '../schema';

export const captureEventTypes = [
  'move',
  'down',
  'click',
  'over',
  'scroll',
  'resize',
] as const;

export type CaptureEventType = (typeof captureEventTypes)[number];

// one line of the immutable NDJSON stream the capture snippet wrote to S3; the
// stream carries more fields than this (screen coordinates, pixel ratio), and
// the derivation only reads the ones it needs
export type CaptureEvent = {
  id: string;
  type: CaptureEventType;
  t: number;
  x: number;
  y: number;
  viewportW: number;
  viewportH: number;
  target?: string;
};

export type AutoZoomOptions = {
  enabled: boolean;
  scale: number;
  leadMs: number;
  holdMs: number;
  minGapMs: number;
};

export type DeriveOptions = {
  // when the take this capture belongs to started, in wall clock. Left out, the
  // capture's own first event is the origin, which is what a creator means by
  // "add the effects I just recorded"
  startedAtEpochMs?: number;
  // shifts every derived time, for a take whose capture and whose clip did not
  // start together; anything pushed before the clip start is dropped
  offsetMs?: number;
  frame: { width: number; height: number };
  ripples?: boolean;
  spotlight?: boolean;
  autoZoom?: AutoZoomOptions;
  dedupeWindowMs?: number;
};

export type DerivedCursor = {
  path: CursorPathPoint[];
  effects: CursorEffect[];
};

export type MergedCursorEffects = {
  effects: CursorEffect[];
  added: number;
  removed: number;
  keptEdits: number;
};
