import { CaptureEvent, CaptureEventType, captureEventTypes } from './types';

const isCaptureEventType = (value: unknown): value is CaptureEventType =>
  typeof value === 'string' &&
  (captureEventTypes as readonly string[]).includes(value);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const toCaptureEvent = (line: string): CaptureEvent | undefined => {
  let raw: unknown;
  try {
    raw = JSON.parse(line);
  } catch {
    return undefined;
  }
  if (typeof raw !== 'object' || raw === null) {
    return undefined;
  }

  const record = raw as Record<string, unknown>;
  const { id, type, t, x, y, viewportW, viewportH, target } = record;
  if (typeof id !== 'string' || id.length === 0 || !isCaptureEventType(type)) {
    return undefined;
  }
  if (
    !isFiniteNumber(t) ||
    !isFiniteNumber(x) ||
    !isFiniteNumber(y) ||
    !isFiniteNumber(viewportW) ||
    !isFiniteNumber(viewportH)
  ) {
    return undefined;
  }

  return {
    id,
    type,
    t,
    x,
    y,
    viewportW,
    viewportH,
    ...(typeof target === 'string' ? { target } : {}),
  };
};

// the stream is written by a snippet running in someone else's page, so a
// truncated or unknown line is skipped rather than failing the whole recording
export const parseCaptureEvents = (ndjson: string): CaptureEvent[] =>
  ndjson
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .flatMap((line) => {
      const event = toCaptureEvent(line);
      return event ? [event] : [];
    });
