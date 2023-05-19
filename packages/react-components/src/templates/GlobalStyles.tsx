import { Global } from '@emotion/react';
import { FC } from 'react';
import emotionNormalize from 'emotion-normalize';

import { fontStyles } from '../text';
import { themes } from '../theme';
import { perRem } from '../pixels';

const styles = {
  html: {
    ...fontStyles,
    ...themes.light,
  },
  'html, body, #root': {
    boxSizing: 'border-box',
    width: '100%',
    minHeight: '100%',
  },
  p: {
    letterSpacing: `${0.1 / perRem}em`,
  },
} as const;
const GlobalStyles: FC<Record<string, never>> = () => (
  <>
    <Global styles={emotionNormalize} />
    <Global styles={styles} />
  </>
);

export default GlobalStyles;
