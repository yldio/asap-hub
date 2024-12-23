import { useEffect } from 'react';

// Types that are definitely suitable to be displayed in analytics go here.
// Set for example is not, but Arrays are rendered comma-joined.
// Non-exhaustive, but we can add what we need.
type DataLayerValue = string | number | ReadonlyArray<DataLayerValue>;
declare global {
  interface Window {
    dataLayer?: Array<Record<string, DataLayerValue | undefined>>;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}
interface GoogleTagManagerProps {
  containerId?: string;
  disabledTracking?: boolean;
}
const GoogleTagManager: React.FC<GoogleTagManagerProps> = ({
  containerId,
  disabledTracking,
}) => {
  useEffect(() => {
    if (containerId && (!('dataLayer' in window) || !window.dataLayer)) {
      Object.defineProperty(window, 'dataLayer', {
        writable: true,
        value: [{ 'gtm.start': new Date().getTime(), event: 'gtm.js' }],
      });
      const scriptUrl = new URL('https://www.googletagmanager.com/gtm.js');
      scriptUrl.searchParams.set('id', containerId);
      import(/* @vite-ignore */ scriptUrl.href);
    }

    if (disabledTracking) {
      window.dataLayer = undefined;
      window[`ga-disable-${containerId}`] = true;
    } else {
      window[`ga-disable-${containerId}`] = false;
    }
  }, [containerId, disabledTracking]);

  return null;
};

export default GoogleTagManager;
