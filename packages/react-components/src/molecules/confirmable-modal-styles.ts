import { css } from '@emotion/react';

import { steel } from '../colors';

// The shade is painted as a pointer-transparent overlay so the controls that
// stay live while confirming (expansion toggles, row links, downloads) keep
// receiving clicks; blocking is done per control via the `enabled` prop.
export const confirmingBodyStyles = css({
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: steel.rgb,
    opacity: 0.4,
    pointerEvents: 'none',
  },
});
