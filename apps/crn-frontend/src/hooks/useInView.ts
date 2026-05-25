import { useEffect, useRef, useState } from 'react';

type UseInViewOptions = {
  /**
   * Margin around the root used to grow/shrink the area used to detect
   * intersection. A positive value triggers the callback before the element
   * is actually visible, so data can start loading slightly ahead of time.
   */
  rootMargin?: string;
};

/**
 * Observes an element and reports once it has come (close to) being in view.
 * The returned flag latches to `true` on first intersection and never flips
 * back, so deferred content does not unmount/refetch when scrolled away.
 *
 * Falls back to always-in-view when IntersectionObserver is unavailable
 * (e.g. jsdom/older browsers) so content is never permanently hidden.
 */
export const useInView = <T extends Element = HTMLDivElement>({
  rootMargin = '200px',
}: UseInViewOptions = {}): [React.RefObject<T>, boolean] => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(
    typeof IntersectionObserver === 'undefined',
  );

  useEffect(() => {
    if (inView || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const element = ref.current;
    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return [ref, inView];
};
