import { Timeline } from '@asap-hub/demo-timeline';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { useApi } from '../../api/ApiProvider';
import { ApiError } from '../../api/client';
import { TimelineAction, timelineReducer } from './timelineReducer';
import {
  canRedo,
  canUndo,
  History,
  initialHistory,
  record,
  redo,
  replace,
  undo,
} from './undo';

export const autosaveMs = 1500;

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

type EditorState = {
  history: History<Timeline>;
  timelineVersion: number;
  version: number;
  saveState: SaveState;
  // a gesture is one continuous thing the creator is doing, such as a drag;
  // every frame after the first replaces the last rather than stacking up
  gesture: boolean;
  gestureRecorded: boolean;
};

type EditorEvent =
  | { type: 'edit'; action: TimelineAction }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'beginGesture' }
  | { type: 'endGesture' }
  | { type: 'saving' }
  | { type: 'saved'; timelineVersion: number; version: number }
  | { type: 'saveFailed' }
  | { type: 'rebase'; version: number };

const editorReducer = (state: EditorState, event: EditorEvent): EditorState => {
  switch (event.type) {
    case 'edit': {
      const next = timelineReducer(state.history.present, event.action);
      if (next === state.history.present) {
        return state;
      }
      const continuing = state.gesture && state.gestureRecorded;
      return {
        ...state,
        gestureRecorded: state.gesture,
        history: continuing
          ? replace(state.history, next)
          : record(state.history, next),
      };
    }

    case 'beginGesture':
      return { ...state, gesture: true, gestureRecorded: false };

    case 'endGesture':
      return { ...state, gesture: false, gestureRecorded: false };

    case 'undo':
      return canUndo(state.history)
        ? { ...state, history: undo(state.history) }
        : state;

    case 'redo':
      return canRedo(state.history)
        ? { ...state, history: redo(state.history) }
        : state;

    case 'saving':
      return { ...state, saveState: 'saving' };

    case 'saved':
      return {
        ...state,
        saveState: 'saved',
        timelineVersion: event.timelineVersion,
        version: event.version,
      };

    case 'saveFailed':
      return { ...state, saveState: 'error' };

    case 'rebase':
      return { ...state, version: event.version };

    default:
      return state;
  }
};

type Options = {
  id: string;
  timeline: Timeline;
  timelineVersion: number;
  version: number;
  readOnly: boolean;
  onLeaseLost: (holderName?: string) => void;
};

export type ProjectEditor = {
  timeline: Timeline;
  saveState: SaveState;
  // edits the server has not taken yet, which is not the same as 'saving':
  // for the length of the debounce there is nothing in flight and nothing saved
  dirty: boolean;
  canUndo: boolean;
  canRedo: boolean;
  // every autosave moves the row on, so anything else that writes to the video
  // has to condition on this rather than on the version the page loaded with
  version: number;
  dispatch: (action: TimelineAction) => void;
  beginGesture: () => void;
  endGesture: () => void;
  undo: () => void;
  redo: () => void;
  rebase: (version: number) => void;
  flush: () => void;
};

// the save model is the one already proven by the chapter editor: debounce, one
// request in flight, and rebase once on a version conflict rather than clobber
export const useProjectEditor = ({
  id,
  timeline,
  timelineVersion,
  version,
  readOnly,
  onLeaseLost,
}: Options): ProjectEditor => {
  const api = useApi();
  const [state, send] = useReducer(editorReducer, undefined, () => ({
    history: initialHistory(timeline),
    timelineVersion,
    version,
    saveState: 'idle' as SaveState,
    gesture: false,
    gestureRecorded: false,
  }));

  const savingRef = useRef(false);
  const pendingRef = useRef<Timeline>();
  const stateRef = useRef(state);
  stateRef.current = state;

  const save = useCallback(
    async (next: Timeline): Promise<void> => {
      if (savingRef.current) {
        pendingRef.current = next;
        return;
      }
      savingRef.current = true;
      send({ type: 'saving' });

      try {
        const saved = await api.saveTimeline(id, {
          timeline: next,
          timelineVersion: stateRef.current.timelineVersion,
          version: stateRef.current.version,
        });
        send({
          type: 'saved',
          timelineVersion: saved.timelineVersion,
          version: saved.video.version,
        });
      } catch (error) {
        if (error instanceof ApiError && error.status === 409) {
          if (error.code === 'locked') {
            onLeaseLost(error.holderName);
          } else {
            // another tab moved the document on; take the fresh version and let
            // the next autosave carry the same edits up again
            const fresh = await api.getVideo(id).catch(() => undefined);
            if (fresh) {
              send({ type: 'rebase', version: fresh.version });
              pendingRef.current = next;
            }
          }
        }
        send({ type: 'saveFailed' });
      } finally {
        savingRef.current = false;
        const queued = pendingRef.current;
        pendingRef.current = undefined;
        if (queued) {
          void save(queued);
        }
      }
    },
    [api, id, onLeaseLost],
  );

  const saved = useRef(timeline);
  const dirty = state.history.present !== saved.current;

  const flush = useCallback(() => {
    const present = stateRef.current.history.present;
    if (present === saved.current) {
      return;
    }
    saved.current = present;
    void save(present);
  }, [save]);

  useEffect(() => {
    if (readOnly || !dirty) {
      return undefined;
    }
    const handle = setTimeout(flush, autosaveMs);
    return () => clearTimeout(handle);
  }, [dirty, flush, readOnly]);

  // Leaving inside the debounce window used to drop the last edit silently, and
  // the lease is handed on regardless, so the next editor would open a document
  // quietly missing it. beforeunload runs before the lease is released.
  const flushRef = useRef(flush);
  flushRef.current = flush;
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty && !readOnly;

  useEffect(() => {
    const onLeaving = (event: BeforeUnloadEvent) => {
      if (!dirtyRef.current) {
        return;
      }
      flushRef.current();
      event.preventDefault();
      // eslint-disable-next-line no-param-reassign
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onLeaving);
    return () => {
      window.removeEventListener('beforeunload', onLeaving);
      // navigating within the app still has a live page, so this one lands
      if (dirtyRef.current) {
        flushRef.current();
      }
    };
  }, []);

  const dispatch = useCallback(
    (action: TimelineAction) => send({ type: 'edit', action }),
    [],
  );
  const beginGesture = useCallback(() => send({ type: 'beginGesture' }), []);
  const endGesture = useCallback(() => send({ type: 'endGesture' }), []);
  const undoEdit = useCallback(() => send({ type: 'undo' }), []);
  const redoEdit = useCallback(() => send({ type: 'redo' }), []);
  const rebase = useCallback(
    (nextVersion: number) => send({ type: 'rebase', version: nextVersion }),
    [],
  );

  return useMemo(
    () => ({
      timeline: state.history.present,
      saveState: state.saveState,
      dirty,
      canUndo: canUndo(state.history),
      canRedo: canRedo(state.history),
      version: state.version,
      dispatch,
      beginGesture,
      endGesture,
      undo: undoEdit,
      redo: redoEdit,
      rebase,
      flush,
    }),
    [
      beginGesture,
      dirty,
      dispatch,
      endGesture,
      flush,
      rebase,
      redoEdit,
      state.history,
      state.saveState,
      state.version,
      undoEdit,
    ],
  );
};
