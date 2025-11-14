import { searchQueryParam } from '@asap-hub/routing';
import { useNavigate, useLocation, NavigateFunction } from 'react-router-dom';

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

export const usePushFromPathname = (
  pathname: string,
): NavigateFunction => {
  const navigate = useNavigate();
  const location = useLocation();
  return (to: string | number | { pathname?: string; search?: string; hash?: string }, options?: { replace?: boolean; state?: unknown }) => {
    if (location.pathname === pathname) {
      if (typeof to === 'number') {
        navigate(to);
      } else if (typeof to === 'string') {
        navigate(to, options);
      } else {
        const path = `${to.pathname || ''}${to.search || ''}${to.hash || ''}`;
        navigate(path, options);
      }
    }
  };
};
export const usePushFromHere = (): ReturnType<typeof usePushFromPathname> =>
  usePushFromPathname(useLocation().pathname);
