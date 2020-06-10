import React from 'react';
import { Global } from '@emotion/core';
import css from '@emotion/css';
import emotionNormalize from 'emotion-normalize';

import { perRem } from '../pixels';
import { charcoal, paper } from '../colors';

const styles = css`
  ${emotionNormalize}
  html {
    font-family: Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif;
    font-size: ${perRem}px;
    line-height: ${24 / 17}em;

    background-color: ${paper.rgb};
    color: ${charcoal.rgb};
  }
`;

const GlobalStyles: React.FC<{}> = () => <Global styles={styles} />;

export default GlobalStyles;
