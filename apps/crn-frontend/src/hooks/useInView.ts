import { useEffect, useRef, useState } from 'react';

type UseInViewOptions = {
  /** Positive value triggers before the element is fully visible. */
  rootMargin?: string;
};

// Latches to true on first intersection; defaults to true when
// IntersectionObserver is unavailable (e.g. jsdom).
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
