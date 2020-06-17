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
`;

const GlobalStyles: React.FC<{}> = () => <Global styles={styles} />;

export default GlobalStyles;
