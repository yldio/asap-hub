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
