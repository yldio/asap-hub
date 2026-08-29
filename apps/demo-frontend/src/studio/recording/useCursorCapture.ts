import {
  CaptureEvent,
  CaptureSurface,
  deriveCursorEffects,
  mergeDerivedEffects,
  parseCaptureEvents,
  sliceCaptureEvents,
} from '@asap-hub/demo-timeline';
import { useCallback, useEffect, useState } from 'react';
import { useApi } from '../../api/ApiProvider';
import { RecordingSession, RecordingSessionStatus } from '../../api/types';
import {
  CaptureApplied,
  CaptureClipTarget,
  CaptureRequest,
} from './cursorPlacement';

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

  // one session collects every take made before the creator applies, so the
  // stream is cut per clip: each target with a take start and a length gets
  // exactly the events its footage was filming, and an event that fell between
  // takes lands on no clip at all
  const deriveTarget = useCallback(
    (
      target: CaptureClipTarget,
      events: CaptureEvent[],
      frame: CaptureRequest['frame'],
    ): CaptureApplied | undefined => {
      if (events.length === 0) {
        return undefined;
      }
      const surface = recorded ?? target.surface;
      const derived = deriveCursorEffects(events, {
        frame,
        surface,
        ...(target.startedAtEpochMs
          ? { startedAtEpochMs: target.startedAtEpochMs }
          : {}),
      });
      const merged = mergeDerivedEffects(target.existing, derived.effects);
      return {
        clipId: target.clipId,
        path: derived.path,
        effects: merged.effects,
        ...(surface ? { surface } : {}),
      };
    },
    [recorded],
  );

  const apply = useCallback(
    async (request: CaptureRequest): Promise<CaptureApplied[] | undefined> => {
      if (!session || request.targets.length === 0) {
        return undefined;
      }
      setApplying(true);
      setError(undefined);
      try {
        const takeStarts = request.targets.flatMap((target) =>
          target.startedAtEpochMs ? [target.startedAtEpochMs] : [],
        );
        await api
          .finaliseCapture(projectId, session.sessionId, {
            ...(takeStarts.length
              ? { startedAtEpochMs: Math.min(...takeStarts) }
              : {}),
            stoppedAtEpochMs: request.stoppedAtEpochMs,
          })
          .catch(() => undefined);

        const ndjson = await api.captureEvents(projectId, session.sessionId);
        const events = parseCaptureEvents(ndjson);
        if (events.length === 0) {
          setError('That capture recorded nothing to add.');
          return undefined;
        }

        const windows = request.targets.flatMap((target) =>
          target.startedAtEpochMs && target.durationMs !== undefined
            ? [
                {
                  clipId: target.clipId,
                  recordedAtEpochMs: target.startedAtEpochMs,
                  durationMs: target.durationMs,
                },
              ]
            : [],
        );
        const sliced = sliceCaptureEvents(events, windows);

        const applied = request.targets.flatMap((target) => {
          const own = windows.some((window) => window.clipId === target.clipId)
            ? sliced.get(target.clipId) ?? []
            : events;
          const result = deriveTarget(target, own, request.frame);
          return result ? [result] : [];
        });

        if (applied.length === 0) {
          setError('That capture has no events during any recorded take.');
          return undefined;
        }
        return applied;
      } catch {
        setError('Could not read the captured events.');
        return undefined;
      } finally {
        setApplying(false);
      }
    },
    [api, deriveTarget, projectId, session],
  );

  return { session, status, applying, error, start, newBookmark, apply };
};
