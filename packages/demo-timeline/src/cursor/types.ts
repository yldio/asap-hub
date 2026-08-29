import { CaptureSurface, CursorEffect, CursorPathPoint } from '../schema';

export const captureEventTypes = [
  'move',
  'down',
  'click',
  'over',
  'scroll',
  'resize',
] as const;

export type CaptureEventType = (typeof captureEventTypes)[number];

// Where the page and the pointer sat on the screen when an event was recorded,
// all in CSS pixels of the screen coordinate space, so a ratio taken inside it
// is free of the display's resolution, its pixel ratio and the browser's zoom.
// Every field is optional: a stream captured before the snippet sent them still
// loads, and falls back to the viewport mapping it was derived under.
export type CaptureGeometry = {
  // the pointer on the virtual desktop, which spans every display: negative or
  // past the primary width when the window is on another monitor
  screenX?: number;
  screenY?: number;
  // the display this window is on, and where its own origin sits on that desktop
  screenW?: number;
  screenH?: number;
  screenLeft?: number;
  screenTop?: number;
  // the browser window's box on the desktop, chrome included
  winX?: number;
  winY?: number;
  winW?: number;
  winH?: number;
};

// one line of the immutable NDJSON stream the capture snippet wrote to S3; the
// stream carries more fields than this (the pixel ratio), and the derivation
// only reads the ones it needs
export type CaptureEvent = CaptureGeometry & {
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
  // what the recording shows, which decides which of the capture's coordinates
  // land on the frame; a capture applied before the studio asked the browser is
  // read as a tab, the way it was read then
  surface?: CaptureSurface;
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
