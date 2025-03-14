/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useContext, useState, useCallback, createContext, FC } from 'react';
import {
  isEnabled,
  disable,
  enable,
  reset,
  getOverrides,
  setCurrentOverrides,
  setEnvironment,
} from '@asap-hub/flags';

type Flags = Pick<
  typeof import('@asap-hub/flags'),
  | 'isEnabled'
  | 'reset'
  | 'disable'
  | 'setCurrentOverrides'
  | 'setEnvironment'
  | 'enable'
>;

const parseCookie = (cookies: string) =>
  cookies
    .split(';')
    .reduce<Record<string, boolean | string> | undefined>((acc, cookie) => {
      const [key, val] = cookie.split('=');
      const flagName = key!.split('_').slice(1).join('_');
      const getFlag = (str: string) => {
        try {
          return ['boolean', 'string'].includes(typeof str)
            ? { [flagName]: str }
            : undefined;
        } catch (e) {
          return undefined;
        }
      };
      return key!.trim().startsWith('ASAP')
        ? { ...acc, ...getFlag(val!) }
        : acc;
    }, undefined);

export const FlagsContext = createContext<Flags>({
  isEnabled,
  disable,
  reset,
  enable,
  setEnvironment,
  setCurrentOverrides: () => setCurrentOverrides(parseCookie(document.cookie)),
});

export const LiveFlagsProvider: FC = ({ children }) => {
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
    setEnvironment,
    setCurrentOverrides,
  };

  return (
    <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>
  );
};
export const useFlags = (): Flags => useContext(FlagsContext);
