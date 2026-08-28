import { RefObject, useCallback, useEffect, useState } from 'react';

export type Fullscreen = {
  supported: boolean;
  active: boolean;
  toggle: () => void;
};

// The browser owns the state, so the hook follows fullscreenchange rather than
// tracking its own flag: leaving with Escape has to be seen too.
export const useFullscreen = (ref: RefObject<Element>): Fullscreen => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onChange = () =>
      setActive(document.fullscreenElement === ref.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, [ref]);

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    } else {
      void ref.current?.requestFullscreen?.().catch(() => undefined);
    }
  }, [ref]);

  return {
    supported:
      typeof document !== 'undefined' && Boolean(document.fullscreenEnabled),
    active,
    toggle,
  };
};
