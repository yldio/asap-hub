import { useContext, useState, useCallback, createContext, FC } from 'react';
import {
  isEnabled,
  disable,
  reset,
  getOverrides,
  setCurrentOverrides,
  Flag,
} from '@asap-hub/flags';

type Flags = Pick<
  typeof import('@asap-hub/flags'),
  'isEnabled' | 'reset' | 'disable'
>;

const parseCookie = (cookies: string, flag: Flag) =>
  cookies
    .split(';')
    .reduce<Record<string, boolean> | undefined>((acc, cookie) => {
      const [key, val] = cookie.split('=');
      const flagName = key.split('_').slice(1).join('_');
      const validateCookie = (str: string) => {
        try {
          const parsed = JSON.parse(str);
          return typeof parsed === 'boolean' ? parsed : false;
        } catch (e) {
          return false;
        }
      };

      return key.trim().endsWith(flag)
        ? { [flagName]: validateCookie(val) }
        : acc;
    }, undefined);

export const FlagsContext = createContext<Flags>({
  isEnabled: (flag) => {
    setCurrentOverrides(parseCookie(document.cookie, flag));
    return isEnabled(flag);
  },
  disable: (flag) => {
    setCurrentOverrides(parseCookie(document.cookie, flag));
    return disable(flag);
  },
  reset,
});

export const LiveFlagsProvider: FC<Record<string, never>> = ({ children }) => {
  // ignore overrides value, new flags object identity every time will be sufficient to update consumers
  const [, setOverrides] = useState(getOverrides());
  const flags: Flags = {
    isEnabled,
    disable: useCallback((flag) => {
      disable(flag);
      setOverrides(getOverrides());
    }, []),
    reset: useCallback(() => {
      reset();
      setOverrides(getOverrides());
    }, []),
  };

  return (
    <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>
  );
};
export const useFlags = (): Flags => useContext(FlagsContext);
