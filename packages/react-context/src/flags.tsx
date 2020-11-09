import React, { useContext, useState, useCallback } from 'react';
import { isEnabled, disable, reset, getOverrides } from '@asap-hub/flags';

type Flags = Pick<
  typeof import('@asap-hub/flags'),
  'isEnabled' | 'reset' | 'disable'
>;
const FlagsContext = React.createContext<Flags>({
  isEnabled,
  disable,
  reset,
});
export const LiveFlagsProvider: React.FC<{}> = ({ children }) => {
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
export const useFlags = () => useContext(FlagsContext);
