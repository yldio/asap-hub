import { searchQueryParam } from '@asap-hub/routing';
import { useNavigate, useLocation } from 'react-router-dom';

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

export const usePushFromPathname = (pathname: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (path: string) => {
    if (location.pathname === pathname) {
      navigate(path);
    }
  };
};
export const usePushFromHere = (): ReturnType<typeof usePushFromPathname> =>
  usePushFromPathname(useLocation().pathname);
