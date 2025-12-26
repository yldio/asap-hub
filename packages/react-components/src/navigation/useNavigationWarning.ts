import { useCallback, useEffect } from 'react';
import {
  NavigateFunction,
  useNavigate,
  NavigateOptions,
} from 'react-router-dom';
import { useNavigationBlocker } from './NavigationBlockerContext';

type UseNavigationWarningOptions = {
  shouldBlock: boolean;
  message?: string;
};

type UseNavigationWarningResult = {
  blockedNavigate: NavigateFunction;
};

const defaultMessage =
  'Are you sure you want to leave? Unsaved changes will be lost.';

export const useNavigationWarning = ({
  shouldBlock,
  message = defaultMessage,
}: UseNavigationWarningOptions): UseNavigationWarningResult => {
  const navigate = useNavigate();
  const { register, requestNavigation } = useNavigationBlocker();

  // Register with context when shouldBlock is true
  useEffect(() => {
    if (!shouldBlock) {
      return undefined;
    }
    const cleanup = register(message);
    return cleanup;
  }, [shouldBlock, message, register]);

  // Handle browser refresh/close/address bar navigation
  useEffect(() => {
    if (!shouldBlock) {
      return undefined;
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [shouldBlock, message]);

  // Handle browser back/forward buttons
  // WARNING: This uses a history manipulation trick that has known quirks:
  // - Adds extra entries to history stack
  // - Forward button behavior may be unexpected after canceling
  // - Does NOT catch programmatic navigate() calls (intentional)
  useEffect(() => {
    if (!shouldBlock) {
      return undefined;
    }

    const handlePopstate = () => {
      // Push a new entry to "undo" the back/forward navigation
      window.history.pushState(null, '', window.location.href);

      // eslint-disable-next-line no-alert
      if (!window.confirm(message)) {
        // User canceled - navigation was already undone by pushState above
        return;
      }

      // User confirmed - go back (this triggers another popstate but we'll let it through)
      window.history.go(-2);
    };

    // Push initial state so we can detect back navigation
    window.history.pushState(null, '', window.location.href);

    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, [shouldBlock, message]);

  // Wrapped navigate that checks blocking first
  const blockedNavigate: NavigateFunction = useCallback(
    (to, options?) => {
      if (!requestNavigation()) {
        return;
      }
      if (typeof to === 'number') {
        navigate(to);
      } else {
        navigate(to, options as NavigateOptions);
      }
    },
    [navigate, requestNavigation],
  );

  return { blockedNavigate };
};

export default useNavigationWarning;
