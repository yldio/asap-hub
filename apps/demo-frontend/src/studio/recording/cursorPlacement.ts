import {
  CaptureSurface,
  ClipPlacement,
  CursorEffect,
  CursorLayer,
  Timeline,
} from '@asap-hub/demo-timeline';

// The time origin is not guessed here, and it is not worked back from the
// timeline either: that put it minutes away from when the capture ran and every
// event fell before zero and was dropped. It is the wall clock the studio wrote
// on the clip's cursor layer when it recorded the take, and it is absent for an
// imported clip, where the derivation falls back to the capture's own events.
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
      ...(layer?.recordedAtEpochMs
        ? { startedAtEpochMs: layer.recordedAtEpochMs }
        : {}),
    },
  };
};
