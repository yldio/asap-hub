import React from 'react';
import { Global } from '@emotion/core';
import css from '@emotion/css';
import emotionNormalize from 'emotion-normalize';

import { fontStyles } from '../text';
import { themes } from '../theme';
import { perRem } from '../pixels';

const styles = css`
  ${emotionNormalize}
  html {
    ${fontStyles}
    ${themes.light}
  }
  html,
  body,
  #root {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
  p {
    letter-spacing: ${0.1 / perRem}em;
  }
`;

const GlobalStyles: React.FC<{}> = () => <Global styles={styles} />;

export default GlobalStyles;
