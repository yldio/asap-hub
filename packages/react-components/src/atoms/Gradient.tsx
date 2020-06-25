import React from 'react';
import css from '@emotion/css';
import { cerulean, fern } from '../colors';

const commonStyles = css({
  height: '6px',
  background: `linear-gradient(90deg, ${cerulean.rgb} 0%,${fern.rgb} 100% )`,
});

const Display: React.FC<{}> = () => (
  <div css={[commonStyles]} role="presentation"></div>
);

export default Display;
