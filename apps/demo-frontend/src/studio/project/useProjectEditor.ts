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
  undo,
} from './undo';

export const autosaveMs = 1500;

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

type EditorState = {
  history: History<Timeline>;
  timelineVersion: number;
  version: number;
  saveState: SaveState;
};

type EditorEvent =
  | { type: 'edit'; action: TimelineAction }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'saving' }
  | { type: 'saved'; timelineVersion: number; version: number }
  | { type: 'saveFailed' }
  | { type: 'rebase'; version: number };

const editorReducer = (state: EditorState, event: EditorEvent): EditorState => {
  switch (event.type) {
    case 'edit': {
      const next = timelineReducer(state.history.present, event.action);
      return next === state.history.present
        ? state
        : { ...state, history: record(state.history, next) };
    }

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
  canUndo: boolean;
  canRedo: boolean;
  // every autosave moves the row on, so anything else that writes to the video
  // has to condition on this rather than on the version the page loaded with
  version: number;
  dispatch: (action: TimelineAction) => void;
  undo: () => void;
  redo: () => void;
  rebase: (version: number) => void;
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
  useEffect(() => {
    if (readOnly || state.history.present === saved.current) {
      return undefined;
    }
    const handle = setTimeout(() => {
      saved.current = state.history.present;
      void save(state.history.present);
    }, autosaveMs);
    return () => clearTimeout(handle);
  }, [readOnly, save, state.history.present]);

  return useMemo(
    () => ({
      timeline: state.history.present,
      saveState: state.saveState,
      canUndo: canUndo(state.history),
      canRedo: canRedo(state.history),
      version: state.version,
      dispatch: (action: TimelineAction) => send({ type: 'edit', action }),
      undo: () => send({ type: 'undo' }),
      redo: () => send({ type: 'redo' }),
      rebase: (nextVersion: number) =>
        send({ type: 'rebase', version: nextVersion }),
    }),
    [state],
  );
};
