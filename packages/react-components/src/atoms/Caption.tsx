import React from 'react';
import css from '@emotion/css';

import * as colors from '../colors';
import { perRem } from '../pixels';
import { layoutStyles, AccentColorName } from '../text';

const styles = css({
  fontSize: `${13.6 / perRem}em`,
  lineHeight: `${18 / 13.6}em`,
});

interface CaptionProps {
  children: React.ReactNode;
  accent?: AccentColorName;
}
const Caption: React.FC<CaptionProps> = ({ children, accent }) => (
  <figcaption
    css={[layoutStyles, styles, accent ? { color: colors[accent].rgb } : null]}
  >
    {children}
  </figcaption>
);

export default Caption;
