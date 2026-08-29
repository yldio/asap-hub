import {
  CaptureSurface,
  ClipPlacement,
  CursorEffect,
  CursorLayer,
  Timeline,
} from '@asap-hub/demo-timeline';

// The time origin is not guessed here. Working it back from the timeline put it
// minutes away from when the capture actually ran and every event fell before
// zero and was dropped; the derivation takes it from the events themselves.
export type CaptureRequest = {
  startedAtEpochMs?: number;
  stoppedAtEpochMs: number;
  frame: { width: number; height: number };
  existing: CursorEffect[];
  // what the last capture on this clip was mapped through, for a studio reopened
  // since the recording was made; a live recorder's answer beats it
  surface?: CaptureSurface;
};

export type CaptureApplied = {
  path: CursorLayer['path'];
  effects: CursorEffect[];
  surface?: CaptureSurface;
};

export type CaptureApply = (
  request: CaptureRequest,
) => Promise<CaptureApplied | undefined>;

export type CaptureTarget = { clipId: string; request: CaptureRequest };

// The capture belongs to whichever clip is under the playhead, because that is
// the recording the creator just made, rather than whatever happens to be first
// on the timeline.
export const captureTarget = (
  timeline: Timeline,
  placement: ClipPlacement | undefined,
  stoppedAtEpochMs: number,
): CaptureTarget | undefined => {
  if (!placement) {
    return undefined;
  }
  const layer = timeline.cursor.find(
    (candidate) => candidate.clipId === placement.clip.id,
  );
  return {
    clipId: placement.clip.id,
    request: {
      stoppedAtEpochMs,
      frame: { width: timeline.canvas.width, height: timeline.canvas.height },
      // a hand edited effect survives the merge, so re-applying a capture does
      // not walk over what the creator already moved
      existing: layer?.effects ?? [],
      ...(layer?.surface ? { surface: layer.surface } : {}),
    },
  };
};
