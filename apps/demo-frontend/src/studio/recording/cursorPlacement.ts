import {
  ClipPlacement,
  CursorEffect,
  CursorLayer,
  Timeline,
} from '@asap-hub/demo-timeline';

export type CaptureRequest = {
  startedAtEpochMs: number;
  stoppedAtEpochMs: number;
  frame: { width: number; height: number };
  existing: CursorEffect[];
};

export type CaptureApplied = {
  path: CursorLayer['path'];
  effects: CursorEffect[];
};

export type CaptureApply = (
  request: CaptureRequest,
) => Promise<CaptureApplied | undefined>;

export type CaptureTarget = { clipId: string; request: CaptureRequest };

// The capture belongs to whichever clip is under the playhead, because that is
// the recording the creator just made, rather than whatever happens to be first
// on the timeline. Its events are stamped in wall clock time, so the origin is
// where that one clip began and not where the whole programme did.
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
      startedAtEpochMs: stoppedAtEpochMs - placement.durationMs,
      stoppedAtEpochMs,
      frame: { width: timeline.canvas.width, height: timeline.canvas.height },
      // a hand edited effect survives the merge, so re-applying a capture does
      // not walk over what the creator already moved
      existing: layer?.effects ?? [],
    },
  };
};
