import { Global } from '@emotion/react';
import { FC } from 'react';
import emotionNormalize from 'emotion-normalize';

import { fontStyles } from '../text';
import { themes } from '../theme';
import { rem } from '../pixels';
import { neutral300, neutral700, neutral800 } from '../colors';

const styles = {
  html: {
    ...fontStyles,
    ...themes.light,
  },
  'html, body, #root': {
    boxSizing: 'border-box',
    width: '100%',
  },
  p: {
    letterSpacing: rem(0.1),
  },

  // WebKit/Chromium...
  '*::-webkit-scrollbar': {
    width: rem(8),
    height: rem(8),
  },
  '*::-webkit-scrollbar-track': {
    background: neutral300.rgb,
    borderRadius: rem(4),
  },
  '*::-webkit-scrollbar-thumb': {
    background: neutral700.rgb,
    borderRadius: rem(4),
    innerWidth: 8,
    outerWidth: 8,
  },
  '*::-webkit-scrollbar-thumb:hover': {
    background: neutral800.rgb,
  },
} as const;
const GlobalStyles: FC<Record<string, never>> = () => (
  <>
    <Global styles={emotionNormalize} />
    <Global styles={styles} />
  </>
);

export default GlobalStyles;
