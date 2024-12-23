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
    if (!containerId) return;

    window[`ga-disable-${containerId}`] = Boolean(disabledTracking);

    if (disabledTracking) {
      window.dataLayer = undefined;
      return;
    }

    if (!window.dataLayer) {
      window.dataLayer = [
        { 'gtm.start': new Date().getTime(), event: 'gtm.js' },
      ];

      const scriptUrl = new URL('https://www.googletagmanager.com/gtm.js');
      scriptUrl.searchParams.set('id', containerId);

      import(/* @vite-ignore */ scriptUrl.href);
    }
  }, [containerId, disabledTracking]);

  return null;
};

export default GoogleTagManager;
