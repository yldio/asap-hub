import {
  CaptureSurface,
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
// The session lives on the server for hours, but it used to live only in this
// hook's state, so a page reload stranded every event already captured: no
// session meant no status, and no status disabled the button that applies them.
const sessionKey = (projectId: string) => `demo-hub.capture.${projectId}`;

// a session stored before the bookmark named the project carries a loader for
// that one take, and saving it again would bring the old trouble back
const reusableBookmark = (session: RecordingSession): RecordingSession =>
  session.snippetUrl?.includes('#project.')
    ? session
    : { ...session, snippetUrl: undefined };

const storedSession = (projectId: string): RecordingSession | undefined => {
  try {
    const raw = window.localStorage.getItem(sessionKey(projectId));
    return raw
      ? reusableBookmark(JSON.parse(raw) as RecordingSession)
      : undefined;
  } catch {
    return undefined;
  }
};

const rememberSession = (
  projectId: string,
  session: RecordingSession | undefined,
): void => {
  try {
    if (session) {
      window.localStorage.setItem(
        sessionKey(projectId),
        JSON.stringify(session),
      );
    } else {
      window.localStorage.removeItem(sessionKey(projectId));
    }
  } catch {
    // a browser refusing storage is not a reason to refuse the capture
  }
};

// `recorded` is what the browser said the last take was a recording of. The
// capture snippet cannot know it: it runs in the page being demoed and has no
// idea whether the creator handed over that tab, this window or the whole
// screen, and each of those puts the page somewhere different in the frame.
export const useCursorCapture = (
  projectId: string,
  recorded?: CaptureSurface,
) => {
  const api = useApi();
  const [session, setSession] = useState<RecordingSession | undefined>(() =>
    storedSession(projectId),
  );
  const [status, setStatus] = useState<RecordingSessionStatus>();
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string>();

  const start = useCallback(() => {
    setError(undefined);
    api
      .startCapture(projectId)
      .then((started) => {
        rememberSession(projectId, started);
        setSession(started);
      })
      .catch(() => setError('Could not start the cursor capture.'));
  }, [api, projectId]);

  // the bookmark is handed out the once it is minted, so a creator who lost
  // theirs asks for another; it is kept on the session the panel is showing,
  // which is what survives a reload
  const newBookmark = useCallback(() => {
    setError(undefined);
    api
      .newCaptureBookmark(projectId)
      .then(({ snippetUrl }) => {
        setSession((current) => {
          if (!current) {
            return current;
          }
          const next = { ...current, snippetUrl, bookmarkReady: true };
          rememberSession(projectId, next);
          return next;
        });
      })
      .catch(() => setError('Could not make a new capture bookmark.'));
  }, [api, projectId]);

  useEffect(() => {
    if (!session) {
      return undefined;
    }
    const poll = () => {
      api
        .captureStatus(projectId, session.sessionId)
        .then((next) => {
          setStatus(next);
          // a restored session the server has since let go would leave a dead
          // panel, so it is dropped and the creator can start another
          if (next.state === 'expired') {
            rememberSession(projectId, undefined);
          }
        })
        .catch(() => {
          rememberSession(projectId, undefined);
          setSession(undefined);
          setStatus(undefined);
        });
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
      surface?: CaptureSurface;
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
        const surface = recorded ?? input.surface;
        const derived = deriveCursorEffects(events, {
          frame: input.frame,
          surface,
        });
        const merged = mergeDerivedEffects(input.existing, derived.effects);

        return {
          path: derived.path,
          ...merged,
          ...(surface ? { surface } : {}),
        };
      } catch {
        setError('Could not read the captured events.');
        return undefined;
      } finally {
        setApplying(false);
      }
    },
    [api, projectId, recorded, session],
  );

  return { session, status, applying, error, start, newBookmark, apply };
};
