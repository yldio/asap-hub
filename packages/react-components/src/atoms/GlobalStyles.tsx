import React from 'react';
import { Global } from '@emotion/core';
import css from '@emotion/css';
import emotionNormalize from 'emotion-normalize';

import { pixelsPerRem } from '../lengths';

const styles = css`
  ${emotionNormalize}
  body {
    font-family: Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif;
    font-size: ${pixelsPerRem}px;
  }
`;

const GlobalStyles: React.FC<{}> = () => <Global styles={styles} />;

export default GlobalStyles;
