import { useCallback, useEffect, useRef, useState } from 'react';

type Options = {
  durationMs: number;
  onEnd?: () => void;
};

export type Playback = {
  playheadMs: number;
  playing: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (ms: number) => void;
  nudge: (deltaMs: number) => void;
};

// the playhead is driven by the clock rather than by any one video element, so
// it keeps running across a clip boundary and over a title card with no media
export const usePlayback = ({ durationMs, onEnd }: Options): Playback => {
  const [playheadMs, setPlayheadMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<number>();
  const lastTickRef = useRef<number>();
  const durationRef = useRef(durationMs);
  durationRef.current = durationMs;
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  const pause = useCallback(() => setPlaying(false), []);
  const play = useCallback(() => {
    if (durationRef.current > 0) {
      setPlaying(true);
    }
  }, []);
  const toggle = useCallback(
    () => (playing ? pause() : play()),
    [pause, play, playing],
  );

  const seek = useCallback((ms: number) => {
    setPlayheadMs(Math.min(durationRef.current, Math.max(0, Math.round(ms))));
  }, []);

  const nudge = useCallback(
    (deltaMs: number) =>
      setPlayheadMs((current) => {
        const next = current + deltaMs;
        return Math.min(durationRef.current, Math.max(0, Math.round(next)));
      }),
    [],
  );

  useEffect(() => {
    if (!playing) {
      lastTickRef.current = undefined;
      return undefined;
    }

    const tick = (now: number) => {
      const last = lastTickRef.current ?? now;
      lastTickRef.current = now;
      setPlayheadMs((current) => {
        const next = current + (now - last);
        if (next >= durationRef.current) {
          setPlaying(false);
          onEndRef.current?.();
          return durationRef.current;
        }
        return next;
      });
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [playing]);

  useEffect(() => {
    if (playheadMs > durationMs) {
      setPlayheadMs(durationMs);
    }
  }, [durationMs, playheadMs]);

  return { playheadMs, playing, play, pause, toggle, seek, nudge };
};
