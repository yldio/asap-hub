import { Global } from '@emotion/react';
import { FC } from 'react';

import { charcoal, fontStyles, pearl, rem, themes } from './theme';

const styles = {
  '*, *::before, *::after': {
    boxSizing: 'border-box' as const,
  },
  html: {
    ...fontStyles,
    ...themes.light,
    backgroundColor: pearl.rgb,
    color: charcoal.rgb,
  },
  'html, body, #root': {
    width: '100%',
    margin: 0,
    minHeight: '100%',
  },
  'h1, h2, h3, h4, h5, h6, p': {
    margin: 0,
  },
  p: {
    letterSpacing: rem(0.1),
  },
};

const GlobalStyles: FC = () => <Global styles={styles} />;

export default GlobalStyles;
