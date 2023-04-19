import { useEffect } from 'react';

// Types that are definitely suitable to be displayed in analytics go here.
// Set for example is not, but Arrays are rendered comma-joined.
// Non-exhaustive, but we can add what we need.
type DataLayerValue = string | number | ReadonlyArray<DataLayerValue>;
declare global {
  interface Window {
    readonly dataLayer?: Array<Record<string, DataLayerValue | undefined>>;
  }
}

interface GoogleTagManagerProps {
  containerId?: string;
}
const GoogleTagManager: React.FC<GoogleTagManagerProps> = ({ containerId }) => {
  useEffect(() => {
    if (containerId && !('dataLayer' in window)) {
      Object.defineProperty(window, 'dataLayer', {
        writable: true,
        value: [{ 'gtm.start': new Date().getTime(), event: 'gtm.js' }],
      });
      const scriptUrl = new URL('https://www.googletagmanager.com/gtm.js');
      scriptUrl.searchParams.set('id', containerId);

      import(/* @vite-ignore */ /* webpackIgnore: true */ scriptUrl.href);
    }
  });

  return null;
};

export default GoogleTagManager;
