import { CaptureEvent } from './types';

// One recorded take on the timeline, in the wall clock the capture events
// carry: the clip's cursor layer kept the instant its footage started, and the
// footage runs for the source's own duration from there.
export type CaptureClipWindow = {
  clipId: string;
  recordedAtEpochMs: number;
  durationMs: number;
};

// A session outlives a take: the creator records, stops, fiddles with the
// studio and records again, all into the same event stream. Each event belongs
// to whichever take was filming when it happened, so the stream is cut into
// [start, start + duration] per clip, and an event that fell between takes
// belongs to no clip and is dropped. Two clips of the same footage share the
// same window and both receive the events.
export const sliceCaptureEvents = (
  events: CaptureEvent[],
  windows: CaptureClipWindow[],
): Map<string, CaptureEvent[]> =>
  new Map(
    windows.map((window) => [
      window.clipId,
      events.filter(
        (event) =>
          event.t >= window.recordedAtEpochMs &&
          event.t <= window.recordedAtEpochMs + window.durationMs,
      ),
    ]),
  );
