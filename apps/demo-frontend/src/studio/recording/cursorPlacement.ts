import {
  CaptureSurface,
  ClipPlacement,
  CursorEffect,
  CursorLayer,
  Timeline,
} from '@asap-hub/demo-timeline';

// One clip a capture can land on. A clip recorded by the studio carries the
// wall clock its footage started at and the footage's own length, so the event
// stream can be cut to exactly the events its take was filming. A clip with no
// origin takes the whole stream, read from its own first event.
export type CaptureClipTarget = {
  clipId: string;
  existing: CursorEffect[];
  surface?: CaptureSurface;
  startedAtEpochMs?: number;
  durationMs?: number;
};

export type CaptureRequest = {
  stoppedAtEpochMs: number;
  frame: { width: number; height: number };
  targets: CaptureClipTarget[];
};

export type CaptureApplied = {
  clipId: string;
  path: CursorLayer['path'];
  effects: CursorEffect[];
  surface?: CaptureSurface;
};

export type CaptureApply = (
  request: CaptureRequest,
) => Promise<CaptureApplied[] | undefined>;

const layerOf = (timeline: Timeline, clipId: string): CursorLayer | undefined =>
  timeline.cursor.find((candidate) => candidate.clipId === clipId);

const targetOf = (
  timeline: Timeline,
  clipId: string,
  window?: { startedAtEpochMs: number; durationMs: number },
): CaptureClipTarget => {
  const layer = layerOf(timeline, clipId);
  return {
    clipId,
    // a hand edited effect survives the merge, so re-applying a capture does
    // not walk over what the creator already moved
    existing: layer?.effects ?? [],
    ...(layer?.surface ? { surface: layer.surface } : {}),
    ...(window ?? {}),
  };
};

// One session collects every take the creator makes before applying, so the
// capture goes to every clip that says when its footage ran: each of those is
// a target, sliced to its own moment. Only a timeline with no such clip at all
// falls back to the old single target, the clip under the playhead, because
// that is all an imported video or an old document can offer.
export const captureTargets = (
  timeline: Timeline,
  placement: ClipPlacement | undefined,
  stoppedAtEpochMs: number,
  assetDurationOf: (assetId: string) => number | undefined,
): CaptureRequest | undefined => {
  const frame = {
    width: timeline.canvas.width,
    height: timeline.canvas.height,
  };

  const recorded = timeline.clips.flatMap((clip) => {
    if (clip.kind !== 'source') {
      return [];
    }
    const startedAtEpochMs = layerOf(timeline, clip.id)?.recordedAtEpochMs;
    if (!startedAtEpochMs) {
      return [];
    }
    // the take filmed the whole source, so the window is the footage's own
    // length even when the clip has since been trimmed
    const durationMs = Math.max(assetDurationOf(clip.assetId) ?? 0, clip.outMs);
    return [targetOf(timeline, clip.id, { startedAtEpochMs, durationMs })];
  });

  if (recorded.length > 0) {
    return { stoppedAtEpochMs, frame, targets: recorded };
  }

  if (!placement) {
    return undefined;
  }
  return {
    stoppedAtEpochMs,
    frame,
    targets: [targetOf(timeline, placement.clip.id)],
  };
};
