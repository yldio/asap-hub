import React from 'react';
import { Global } from '@emotion/core';
import css from '@emotion/css';
import emotionNormalize from 'emotion-normalize';

import { fontStyles } from '../text';

const styles = css`
  ${emotionNormalize}
  html {
    ${fontStyles}
  }
  html,
  body,
  #root {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
`;

const GlobalStyles: React.FC<{}> = () => <Global styles={styles} />;

export default GlobalStyles;
