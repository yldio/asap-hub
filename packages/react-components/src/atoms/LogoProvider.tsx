import type { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import React, { Suspense, lazy, createContext, useContext } from 'react';

const loadCRNLogo = () =>
  import('../icons/crn-logo-full').then((module) => ({
    default: () => module.default,
  }));
const loadGP2Logo = () =>
  import('../icons/gp2-logo-full').then((module) => ({
    default: () => module.default,
  }));
const LogoContext = createContext<EmotionJSX.Element | null>(null);

const LazyCRNLogo = lazy(loadCRNLogo);
const LazyGP2Logo = lazy(loadGP2Logo);

export const LogoProvider: React.FC<{ appName: 'CRN' | 'GP2' }> = ({
  appName,
  children,
}) => {
  const logo = appName === 'CRN' ? <LazyCRNLogo /> : <LazyGP2Logo />;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LogoContext.Provider value={logo}>{children}</LogoContext.Provider>
    </Suspense>
  );
};

export const useLogo = () => useContext(LogoContext);
