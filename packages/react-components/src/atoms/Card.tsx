import React from 'react';
import css, { CSSObject } from '@emotion/css';

import * as colors from '../colors';
import { perRem } from '../pixels';
import { themes } from '../theme';
import { paddingStyles } from '../card';

export type AccentVariant = 'default' | 'red' | 'green';

export const accents: Record<AccentVariant, CSSObject> = {
  default: {
    ...themes.light,
    borderColor: colors.steel.rgb,
    boxShadow: `0px 2px 4px ${colors.steel.rgb}`,
  },
  red: {
    backgroundColor: colors.rose.rgb,
    color: colors.ember.rgb,
    borderColor: colors.ember.rgb,
  },
  green: {
    backgroundColor: colors.mint.rgb,
    color: colors.pine.rgb,
    borderColor: colors.pine.rgb,
  },
};

const containerStyles = css({
  boxSizing: 'border-box',
  maxWidth: '100%',

  borderStyle: 'solid',
  borderWidth: 1,

  borderRadius: `${6 / perRem}em`,
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
