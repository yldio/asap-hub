import { useState } from 'react';
import { useLastLocation } from 'react-router-dom-last-location';

export const useBackHref = (): string | null => {
  const [lastLocationWhenEntering] = useState(useLastLocation());
  const lastLocation = lastLocationWhenEntering.lastLocation;
  return lastLocation
    ? lastLocation.pathname + lastLocation.search + lastLocation.hash
    : null;
};
