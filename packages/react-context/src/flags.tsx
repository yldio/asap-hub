import { useContext, useState, useCallback, createContext, FC } from 'react';
import {
  isEnabled,
  disable,
  reset,
  getOverrides,
  setManualOverrides,
} from '@asap-hub/flags';

type Flags = Pick<
  typeof import('@asap-hub/flags'),
  'isEnabled' | 'reset' | 'disable'
>;

const FF = 'ASAP_FF';

const getCookieByName = (cookies: string, name: string) =>
  cookies.split(';').reduce((acc, cookie) => {
    const [key, val] = cookie.split('=');

    if (key.trim() === name) val;
    return acc;
  }, '');

const parseCookie = (cookies: string) => {
  try {
    const parsed = JSON.parse(getCookieByName(document.cookie, FF));
    if (Array.isArray(parsed)) return false;
    if (Object.keys(parsed).length === 0) return false;
    return parsed;
  } catch (e) {
    return false;
  }
};

export const FlagsContext = createContext<Flags>({
  isEnabled: (flag) => {
    setManualOverrides(parseCookie(document.cookie));
    return isEnabled(flag);
  },
  disable: (flag) => {
    setManualOverrides(parseCookie(document.cookie));
    return disable(flag);
  },
  reset: () => {
    setManualOverrides(parseCookie(document.cookie));
    return reset();
  },
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
