import {
  useState,
  useEffect,
  DependencyList,
  useRef,
  MutableRefObject,
} from 'react';

export const useGifReplay = (
  url: string,
  dependencies: DependencyList,
): string => {
  const [rand, setRand] = useState(Math.random());
  useEffect(() => {
    setRand(Math.random());
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
  return `${url}#${rand}`;
};

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  // This hook must run on every render to keep the ref updated.
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useIsMounted = (): MutableRefObject<boolean> => {
  const isMounted = useRef(true);
  useEffect(
    () => () => {
      isMounted.current = false;
    },
    [],
  );
  return isMounted;
};

/**
 * A declarative interval hook that always calls the latest callback.
 * Uses useRef to avoid stale closure issues with React 18's automatic batching.
 * Uses recursive setTimeout instead of setInterval for better Jest fake timer compatibility.
 *
 * @param callback - Function to call on each interval tick
 * @param delay - Interval delay in milliseconds, or null to pause the interval
 *
 * @see https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
export const useInterval = (
  callback: () => void,
  delay: number | null,
): void => {
  const savedCallback = useRef(callback);

  // Remember the latest callback - updates on every render
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval using recursive setTimeout
  // This pattern works better with Jest fake timers than setInterval
  useEffect(() => {
    if (delay === null) return undefined;

    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      savedCallback.current();
      timeoutId = setTimeout(tick, delay);
    };

    timeoutId = setTimeout(tick, delay);

    return () => clearTimeout(timeoutId);
  }, [delay]);
};
