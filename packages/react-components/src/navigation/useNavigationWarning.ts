import { useCallback, useEffect, useRef } from 'react';
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

  /**
   * Track intentional navigations from blockedNavigate to prevent double confirmation
   */
  const intentionalNavigationRef = useRef(false);

  /**
   * Track whether we've pushed a dummy history entry
   */
  const hasDummyEntryRef = useRef(false);

  useEffect(() => {
    if (!shouldBlock) {
      return undefined;
    }
    const cleanup = register(message);
    return cleanup;
  }, [shouldBlock, message, register]);

  // Handle browser refresh/close/address-bar navigation
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
  // - Does NOT catch programmatic navigate() calls (intentional, use `blockedNavigate` helper for that)
  useEffect(() => {
    if (!shouldBlock) {
      return undefined;
    }

    const handlePopstate = () => {
      // Skip confirmation for intentional navigations from `blockedNavigate`
      if (intentionalNavigationRef.current) {
        intentionalNavigationRef.current = false;
        return;
      }

      // Push a new dummy entry to "undo" the navigation
      window.history.pushState(null, '', window.location.href);

      if (!window.confirm(message)) {
        // User canceled, navigation was already undone by pushState above
        return;
      }

      window.history.go(-2); // User confirmed, go back the dummy entry plus a additional one.
    };

    // Guard against double push in StrictMode (effect runs twice: mount -> cleanup -> mount,
    // but the ref persists, preventing duplicate history entries)
    if (!hasDummyEntryRef.current) {
      // For future travelers: popstate triggers once the navigation has happened, which would
      // be too late to prevent the navigation from happening.
      // So, we create a dummy entry to the same URL the user is seeing so that we can catch
      // the navigation event when they click "Back" or navigate away.
      window.history.pushState(null, '', window.location.href);
      hasDummyEntryRef.current = true;
    }

    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, [shouldBlock, message]);

  useEffect(() => {
    if (!shouldBlock && hasDummyEntryRef.current) {
      // Clean up dummy history entry when shouldBlock becomes false
      window.history.back();
      hasDummyEntryRef.current = false;
    }
  }, [shouldBlock]);

  // Wrapped navigate that checks blocking first
  const blockedNavigate: NavigateFunction = useCallback(
    (to, options?) => {
      if (!requestNavigation()) {
        return;
      }
      if (typeof to === 'number') {
        // Mark as intentional so popstate handler skips confirmation.
        // Must be set BEFORE any navigation to prevent double confirm dialog.
        intentionalNavigationRef.current = true;

        if (hasDummyEntryRef.current) {
          // Navigate with offset to account for dummy history entry pushed
          // by the popstate blocking effect. Since `to` is
          // usually -1 ("Go back"), this translates to -2 most of the time.
          window.history.go(to - 1);
        } else {
          navigate(to);
        }
      } else {
        navigate(to, options as NavigateOptions);
      }
    },
    [navigate, requestNavigation],
  );

  return { blockedNavigate };
};

export default useNavigationWarning;
