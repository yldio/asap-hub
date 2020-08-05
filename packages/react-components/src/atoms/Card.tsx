import React from 'react';
import css from '@emotion/css';

import * as colors from '../colors';
import { perRem } from '../pixels';

const containerStyles = css({
  backgroundColor: colors.paper.rgb,
  borderRadius: `${10 / perRem}em`,
  border: `1px solid ${colors.silver.rgb}`,
  padding: `${24 / perRem}em`,
});

interface CardProps {
  readonly children: React.ReactNode;
}
const Card: React.FC<CardProps> = ({ children }) => (
  <div css={[containerStyles]}>{children}</div>
);

export default Card;
