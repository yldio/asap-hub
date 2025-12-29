import { createContext, useCallback, useContext, useState } from 'react';

type NavigationBlockerContextType = {
  /**
   * Returns the cleanup function
   */
  register: (message?: string) => () => void;
  isBlocked: boolean;
  message: string;
  /**
   * Shows the confirm window (window.confirm) and returns user choice
   */
  requestNavigation: () => boolean;
};

const defaultMessage =
  'Are you sure you want to leave? Unsaved changes will be lost.';

/**
 * Default context that's safe to use without provider (passthrough behavior)
 */
const defaultContext: NavigationBlockerContextType = {
  register: () => () => {
    /* noop - default cleanup function */
  },
  isBlocked: false,
  message: defaultMessage,
  requestNavigation: () => true,
};

const NavigationBlockerContext =
  createContext<NavigationBlockerContextType>(defaultContext);

type NavigationBlockerProviderProps = {
  children: React.ReactNode;
};

export const NavigationBlockerProvider: React.FC<
  NavigationBlockerProviderProps
> = ({ children }) => {
  const [blockerMessage, setBlockerMessage] = useState<string | null>(null);

  const register = useCallback((message: string = defaultMessage) => {
    setBlockerMessage(message);
    return () => {
      setBlockerMessage(null);
    };
  }, []);

  const requestNavigation = useCallback(() => {
    if (!blockerMessage) {
      return true;
    }
    return window.confirm(blockerMessage);
  }, [blockerMessage]);

  const value: NavigationBlockerContextType = {
    register,
    isBlocked: blockerMessage !== null,
    message: blockerMessage ?? defaultMessage,
    requestNavigation,
  };

  return (
    <NavigationBlockerContext.Provider value={value}>
      {children}
    </NavigationBlockerContext.Provider>
  );
};

export const useNavigationBlocker = (): NavigationBlockerContextType =>
  useContext(NavigationBlockerContext);

export default NavigationBlockerContext;
