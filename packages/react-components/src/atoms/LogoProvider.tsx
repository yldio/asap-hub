import type { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import React, { createContext, useContext } from 'react';
import { crnLogoFull, gp2LogoFull } from '../icons';

const LogoContext = createContext<EmotionJSX.Element | null>(null);

export const LogoProvider: React.FC<{ appName: 'CRN' | 'GP2' }> = ({
  appName,
  children,
}) => {
  const logo = appName === 'CRN' ? crnLogoFull : gp2LogoFull;
  return <LogoContext.Provider value={logo}>{children}</LogoContext.Provider>;
};

export const useLogo = () => useContext(LogoContext);
