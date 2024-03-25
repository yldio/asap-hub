import { useState } from 'react';
import { useLastLocation } from 'react-router-dom-last-location';

export const useBackHref = (): string | null => {
  const [lastLocationWhenEntering] = useState(useLastLocation());
  return (
    lastLocationWhenEntering &&
    lastLocationWhenEntering.pathname +
      lastLocationWhenEntering.search +
      lastLocationWhenEntering.hash
  );
};
