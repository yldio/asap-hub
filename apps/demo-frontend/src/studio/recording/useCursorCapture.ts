import {
  deriveCursorEffects,
  mergeDerivedEffects,
  parseCaptureEvents,
} from '@asap-hub/demo-timeline';
import { useCallback, useEffect, useState } from 'react';
import { useApi } from '../../api/ApiProvider';
import { RecordingSession, RecordingSessionStatus } from '../../api/types';

export type AppliedCapture = {
  path: ReturnType<typeof deriveCursorEffects>['path'];
  effects: ReturnType<typeof deriveCursorEffects>['effects'];
  startedAtEpochMs: number;
};

const pollMs = 5000;

// The raw stream stays immutable in S3. This turns it into ordinary timeline
// items once, and every later edit of those items is the creator's, not ours.
export const useCursorCapture = (projectId: string) => {
  const api = useApi();
  const [session, setSession] = useState<RecordingSession>();
  const [status, setStatus] = useState<RecordingSessionStatus>();
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string>();

  const start = useCallback(() => {
    setError(undefined);
    api
      .startCapture(projectId)
      .then(setSession)
      .catch(() => setError('Could not start the cursor capture.'));
  }, [api, projectId]);

  useEffect(() => {
    if (!session) {
      return undefined;
    }
    const poll = () => {
      api
        .captureStatus(projectId, session.sessionId)
        .then(setStatus)
        .catch(() => undefined);
    };
    poll();
    const handle = setInterval(poll, pollMs);
    return () => clearInterval(handle);
  }, [api, projectId, session]);

  const apply = useCallback(
    async (input: {
      // optional: the capture's own events carry the origin
      startedAtEpochMs?: number;
      stoppedAtEpochMs: number;
      frame: { width: number; height: number };
      existing: Parameters<typeof mergeDerivedEffects>[0];
    }) => {
      if (!session) {
        return undefined;
      }
      setApplying(true);
      setError(undefined);
      try {
        await api
          .finaliseCapture(projectId, session.sessionId, {
            startedAtEpochMs: input.startedAtEpochMs,
            stoppedAtEpochMs: input.stoppedAtEpochMs,
          })
          .catch(() => undefined);

        const ndjson = await api.captureEvents(projectId, session.sessionId);
        const events = parseCaptureEvents(ndjson);
        if (events.length === 0) {
          setError('That capture recorded nothing to add.');
          return undefined;
        }

        // no startedAtEpochMs: the capture's own first event is the origin. The
        // caller cannot know it, and guessing one put every event before zero,
        // where they were all dropped and the button silently did nothing
        const derived = deriveCursorEffects(events, { frame: input.frame });
        const merged = mergeDerivedEffects(input.existing, derived.effects);

        return { path: derived.path, ...merged };
      } catch {
        setError('Could not read the captured events.');
        return undefined;
      } finally {
        setApplying(false);
      }
    },
    [api, projectId, session],
  );

  return { session, status, applying, error, start, apply };
};
