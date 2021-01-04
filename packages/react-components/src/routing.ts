import { History } from 'history';
import { useHistory, useLocation } from 'react-router-dom';

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
): History<unknown>['push'] => {
  const history = useHistory();
  return (...args: Parameters<History['push']>) => {
    if (history.location.pathname === pathname) {
      history.push(...args);
    }
  };
};
export const usePushFromHere = (): ReturnType<typeof usePushFromPathname> =>
  usePushFromPathname(useLocation().pathname);
