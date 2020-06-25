import React from 'react';

import { ThemeVariant } from '../theme';
import { OpaqueColor, paper, charcoal, tin, lead } from '../colors';

const backgroundColors: Record<ThemeVariant, OpaqueColor> = {
  light: paper,
  dark: charcoal,
  grey: tin,
};
const colors: Record<ThemeVariant, OpaqueColor> = {
  light: charcoal,
  dark: paper,
  grey: lead,
};

interface ThemeProps {
  readonly children: React.ReactNode;
  readonly variant?: ThemeVariant;
}

const Theme: React.FC<ThemeProps> = ({ children, variant = 'light' }) => (
  <div
    css={{
      backgroundColor: backgroundColors[variant].rgb,
      color: colors[variant].rgb,
    }}
  >
    {children}
  </div>
);

export default Theme;
