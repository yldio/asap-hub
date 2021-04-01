import React, { useEffect } from 'react';

declare global {
  interface Window {
    readonly dataLayer: Array<Record<string, unknown>>;
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
      import(/* webpackIgnore: true */ scriptUrl.href);
    }
  });

  return null;
};

export default GoogleTagManager;
