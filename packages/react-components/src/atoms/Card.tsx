import React from 'react';
import css from '@emotion/css';

import * as colors from '../colors';
import { perRem } from '../pixels';
import { themes } from '../theme';
import { paddingStyles } from '../card';

export type AccentVariant = 'default' | 'red' | 'green';

export const accents: Record<AccentVariant, string> = {
  default: `${themes.light} border-color: ${colors.silver.rgb};`,
  red: `background-color: ${colors.rose.rgb}; color: ${colors.ember.rgb};  border-color: ${colors.ember.rgb};`,
  green: `background-color: ${colors.mint.rgb}; color: ${colors.pine.rgb};  border-color: ${colors.pine.rgb};`,
};

const containerStyles = css({
  boxSizing: 'border-box',
  maxWidth: '100%',

  borderStyle: 'solid',
  borderWidth: 1,

  borderRadius: `${6 / perRem}em`,
  overflow: 'hidden', // for round corners
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
