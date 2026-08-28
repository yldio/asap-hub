import { useEffect, useRef } from 'react';

export type EditorShortcuts = {
  readOnly: boolean;
  onToggle: () => void;
  onNudge: (deltaMs: number) => void;
  onSplit: () => void;
  onDuplicate: () => void;
  onToggleMute: () => void;
  onRemove: () => void;
};

const isTyping = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable);

// The handlers change on every frame of playback, so the listener reads the
// latest ones through a ref rather than resubscribing sixty times a second.
export const useEditorShortcuts = (shortcuts: EditorShortcuts): void => {
  const latest = useRef(shortcuts);
  latest.current = shortcuts;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTyping(event.target)) {
        return;
      }
      const {
        readOnly,
        onToggle,
        onNudge,
        onSplit,
        onDuplicate,
        onToggleMute,
        onRemove,
      } = latest.current;

      const transport: Record<string, () => void> = {
        Space: onToggle,
        ArrowLeft: () => onNudge(event.shiftKey ? -1000 : -100),
        ArrowRight: () => onNudge(event.shiftKey ? 1000 : 100),
      };
      const editing: Record<string, () => void> = {
        KeyS: onSplit,
        KeyD: onDuplicate,
        KeyM: onToggleMute,
        Delete: onRemove,
        Backspace: onRemove,
      };

      const move = transport[event.code];
      if (move) {
        event.preventDefault();
        move();
        return;
      }

      const edit = editing[event.code];
      if (edit && !readOnly) {
        edit();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
};
