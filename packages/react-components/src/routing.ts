import { searchQueryParam } from '@asap-hub/routing';
import { useNavigate, useLocation, NavigateFunction } from 'react-router-dom';
import { useRef, useEffect } from 'react';

export const useScrollToHash = (): void => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      // Delay to allow React to render the target element
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [hash, pathname]);
};

export const queryParamString = (searchQuery: string | undefined): string => {
  let searchQueryParamString = '';
  if (searchQuery) {
    searchQueryParamString = `?${new URLSearchParams({
      [searchQueryParam]: searchQuery,
    }).toString()}`;
  }
  return searchQueryParamString;
};

export const useHasRouter = (): boolean => {
  try {
    useLocation();
    return true;
  } catch {
    return false;
  }
};

export const usePushFromPathname = (pathname: string): NavigateFunction => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationRef = useRef(location);

  // Keep locationRef updated with current location
  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  // Use useRef to create a stable function reference
  const fnRef = useRef<NavigateFunction>(
    (
      to:
        | string
        | number
        | { pathname?: string; search?: string; hash?: string },
      options?: { replace?: boolean; state?: unknown },
    ) => {
      // Check current location at call time via ref
      if (locationRef.current.pathname === pathname) {
        if (typeof to === 'number') {
          navigate(to);
        } else if (typeof to === 'string') {
          navigate(to, options);
        } else {
          const path = `${to.pathname || ''}${to.search || ''}${to.hash || ''}`;
          navigate(path, options);
        }
      }
    },
  );

  return fnRef.current;
};
export const usePushFromHere = (): ReturnType<typeof usePushFromPathname> =>
  usePushFromPathname(useLocation().pathname);
