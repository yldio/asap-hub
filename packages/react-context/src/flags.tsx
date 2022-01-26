import { useContext, useState, useCallback, createContext, FC } from 'react';
import {
  isEnabled,
  disable,
  enable,
  reset,
  getOverrides,
  setCurrentOverrides,
} from '@asap-hub/flags';

type Flags = Pick<
  typeof import('@asap-hub/flags'),
  'isEnabled' | 'reset' | 'disable' | 'setCurrentOverrides' | 'enable'
>;

const parseCookie = (cookies: string) =>
  cookies
    .split(';')
    .reduce<Record<string, boolean> | undefined>((acc, cookie) => {
      const [key, val] = cookie.split('=');
      const flagName = key.split('_').slice(1).join('_');
      const getFlag = (str: string) => {
        try {
          const parsed = JSON.parse(str);
          return typeof parsed === 'boolean'
            ? { [flagName]: parsed }
            : undefined;
        } catch (e) {
          return undefined;
        }
      };

      return key.trim().startsWith('ASAP') ? getFlag(val) : acc;
    }, undefined);

export const FlagsContext = createContext<Flags>({
  isEnabled,
  disable,
  reset,
  enable,
  setCurrentOverrides: () => setCurrentOverrides(parseCookie(document.cookie)),
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
    enable: useCallback((flag) => {
      enable(flag);
      setOverrides(getOverrides());
    }, []),
    reset: useCallback(() => {
      reset();
      setOverrides(getOverrides());
    }, []),
    setCurrentOverrides,
  };

  return (
    <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>
  );
};
export const useFlags = (): Flags => useContext(FlagsContext);
