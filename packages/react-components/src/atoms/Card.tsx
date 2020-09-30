import React from 'react';
import css from '@emotion/css';

import * as colors from '../colors';
import { perRem } from '../pixels';
import { themes } from '../theme';
import { paddingStyles } from '../card';

export type AccentVariant = 'default' | 'red' | 'green';

export const accents: Record<AccentVariant, string> = {
  default: `border-color: ${colors.silver.rgb};`,
  red: `background-color: ${colors.rose.rgb}; color: ${colors.ember.rgb};  border-color: ${colors.ember.rgb};`,
  green: `background-color: ${colors.mint.rgb}; color: ${colors.pine.rgb};  border-color: ${colors.pine.rgb};`,
};

const containerStyles = css({
  borderStyle: 'solid',
  borderWidth: 1,

  borderRadius: `${6 / perRem}em`,
  overflow: 'hidden',
});

interface CardProps {
  readonly accent?: AccentVariant;
  readonly padding?: boolean;

  readonly children: React.ReactNode;
}
const Card: React.FC<CardProps> = ({
  children,
  accent = 'default',
  padding = true,
}) => (
  <section
    css={[
      themes.light,
      containerStyles,
      padding && paddingStyles,
      accents[accent],
    ]}
  >
    {children}
  </section>
);

export default Card;
