import React from 'react';
import css from '@emotion/css';

import * as colors from '../colors';
import { perRem } from '../pixels';

const containerStyles = css({
  border: `1px solid ${colors.silver.rgb}`,
  padding: `${24 / perRem}em`,
});

interface CaptionProps {
  readonly children: React.ReactNode;
}
const Caption: React.FC<CaptionProps> = ({ children }) => (
  <div css={[containerStyles]}>{children}</div>
);

export default Caption;
