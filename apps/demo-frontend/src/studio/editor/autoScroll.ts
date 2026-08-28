import { RefObject, useCallback, useEffect, useMemo, useRef } from 'react';

export type EdgeBounds = { left: number; right: number };

// the strip at each end of the visible lane a drag has to reach before the
// lane starts moving under it, and the speed it reaches at the very edge
export const edgeZonePx = 56;
export const maxEdgeScrollPxPerSecond = 1400;

const clampUnit = (value: number): number => Math.max(-1, Math.min(1, value));

// Pixels per second, negative towards the start. The speed rises with how deep
// into the zone the pointer is so a drag can creep or race, and a pointer that
// has left the lane altogether is held at full speed rather than run away.
export const edgeScrollVelocity = (
  clientX: number,
  bounds: EdgeBounds,
  zonePx: number = edgeZonePx,
  maxPxPerSecond: number = maxEdgeScrollPxPerSecond,
): number => {
  // two zones meeting in the middle would scroll on a pointer sitting still
  if (zonePx <= 0 || bounds.right - bounds.left < zonePx * 2) {
    return 0;
  }

  const intoLeft = clientX - (bounds.left + zonePx);
  if (intoLeft < 0) {
    return clampUnit(intoLeft / zonePx) * maxPxPerSecond;
  }

  const intoRight = clientX - (bounds.right - zonePx);
  if (intoRight > 0) {
    return clampUnit(intoRight / zonePx) * maxPxPerSecond;
  }

  return 0;
};

export const scrollLeftAfter = (
  scrollLeft: number,
  deltaPx: number,
  maxScrollLeft: number,
): number =>
  Math.max(0, Math.min(Math.max(0, maxScrollLeft), scrollLeft + deltaPx));

export type EdgeAutoScroll = {
  start: () => void;
  track: (clientX: number) => void;
  stop: () => void;
};

// The lane keeps moving while the pointer is held at its edge, so the drag can
// carry on past what the window shows without reaching for the wheel. Each
// frame only writes scrollLeft and tells the drag to read the clock again, so
// nothing here goes through React.
export const useEdgeAutoScroll = (
  scroller: RefObject<HTMLElement>,
  onScrolled: () => void,
): EdgeAutoScroll => {
  const frame = useRef<number>();
  const pointerX = useRef(0);
  // negative until the first frame of a run: a timestamp of zero is a real one
  const lastTime = useRef(-1);
  const scrolled = useRef(onScrolled);

  useEffect(() => {
    scrolled.current = onScrolled;
  }, [onScrolled]);

  const track = useCallback((clientX: number) => {
    pointerX.current = clientX;
  }, []);

  const stop = useCallback(() => {
    if (frame.current !== undefined) {
      cancelAnimationFrame(frame.current);
      frame.current = undefined;
    }
    lastTime.current = -1;
  }, []);

  const start = useCallback(() => {
    if (frame.current !== undefined) {
      return;
    }
    lastTime.current = -1;

    const run = (now: number): void => {
      frame.current = requestAnimationFrame(run);
      const lane = scroller.current;
      if (!lane) {
        return;
      }

      const elapsed =
        lastTime.current < 0 ? 0 : (now - lastTime.current) / 1000;
      lastTime.current = now;
      const velocity = edgeScrollVelocity(
        pointerX.current,
        lane.getBoundingClientRect(),
      );
      if (velocity === 0 || elapsed <= 0) {
        return;
      }

      const next = scrollLeftAfter(
        lane.scrollLeft,
        velocity * elapsed,
        lane.scrollWidth - lane.clientWidth,
      );
      if (next === lane.scrollLeft) {
        return;
      }
      lane.scrollLeft = next;
      scrolled.current();
    };

    frame.current = requestAnimationFrame(run);
  }, [scroller]);

  useEffect(() => stop, [stop]);

  return useMemo(() => ({ start, track, stop }), [start, stop, track]);
};
