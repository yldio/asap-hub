import { MouseEvent, useCallback } from 'react';
import { useNavigationBlocker } from './NavigationBlockerContext';

type ClickHandler<T extends HTMLElement = HTMLElement> = (
  event: MouseEvent<T>,
) => void;

/**
 * Returns an onClick handler that checks navigation blocking
 * before allowing the click to proceed.
 *
 * If you need your link to be compliant with `useNavigationWarning`,
 * you need to use this hook in order to verify that navigation
 * isn't blocked before allowing the user to navigate away.
 *
 * Usage:
 *   const blockedClick = useBlockedClick(originalOnClick);
 *   <Link onClick={blockedClick} />
 */
export const useBlockedClick = <T extends HTMLElement = HTMLElement>(
  handler?: ClickHandler<T>,
) => {
  const { requestNavigation } = useNavigationBlocker();

  return useCallback(
    (event: MouseEvent<T>) => {
      if (!requestNavigation()) {
        event.preventDefault();
        return;
      }
      handler?.(event);
    },
    [requestNavigation, handler],
  );
};

export default useBlockedClick;
